import { spawn } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createServer, request } from "node:http";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const BASE = "/minside/utkast";
const CONTROL = `${BASE}/__preview`;
const COOKIE = "tms-preview";
const MAIN = "main";
const ENTRY = "dist/server/entry.mjs";
const ROOT = process.cwd();
const VERSION_ROOTS = [resolve(ROOT, "versions"), resolve(ROOT, "..", "preview-bundled")];
const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";
const HEAP_MB = Number(process.env.PREVIEW_HEAP_MB ?? 128);
const IDLE_MS = Number(process.env.PREVIEW_IDLE_MINUTES ?? 20) * 60_000;
const MAX_WARM = Number(process.env.PREVIEW_MAX_WARM ?? 3);
const START_MS = Number(process.env.PREVIEW_START_SECONDS ?? 20) * 1000;
const VALID_ID = /^[a-z0-9-]{1,40}$/;

const startedAt = Date.now();
const children = new Map();
let nextPort = PORT + 1;
let stopping = false;

const versionDir = (id) =>
  VERSION_ROOTS.map((root) => resolve(root, id)).find((dir) => existsSync(resolve(dir, ENTRY)));

const buildRoot = (id) => (id === MAIN ? ROOT : versionDir(id));

const hasBuild = (id) => id === MAIN || (VALID_ID.test(id) && Boolean(versionDir(id)));

const buildIds = () => {
  const found = VERSION_ROOTS.flatMap((root) => (existsSync(root) ? readdirSync(root) : [])).filter(hasBuild);
  return [MAIN, ...[...new Set(found)].sort()];
};

const selected = (req) => {
  const match = (req.headers.cookie ?? "").match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]*)`));
  return match ? match[1] : MAIN;
};

const isAlive = (port) =>
  new Promise((done) => {
    const probe = request({ host: "127.0.0.1", port, path: `${BASE}/api/internal/isAlive`, timeout: 1000 }, (res) => {
      res.resume();
      done(res.statusCode === 200);
    });
    probe.on("error", () => done(false));
    probe.on("timeout", () => probe.destroy());
    probe.end();
  });

const waitUntilAlive = async (child) => {
  const deadline = Date.now() + START_MS;
  while (Date.now() < deadline) {
    if (child.exited) throw new Error("exited");
    if (await isAlive(child.port)) return;
    await new Promise((next) => setTimeout(next, 50));
  }
  throw new Error("timeout");
};

const stopBuild = (child) => {
  if (children.get(child.id) === child) children.delete(child.id);
  child.proc.kill("SIGTERM");
};

const trimWarm = (keep) => {
  const warm = [...children.values()]
    .filter((child) => child.id !== MAIN && child.id !== keep)
    .sort((a, b) => a.lastUsed - b.lastUsed);
  while (warm.length > 0 && warm.length >= MAX_WARM) stopBuild(warm.shift());
};

const startBuild = (id) => {
  const running = children.get(id);
  if (running) return running;
  const started = performance.now();
  const port = nextPort++;
  const proc = spawn(process.execPath, [`--max-old-space-size=${HEAP_MB}`, ENTRY], {
    cwd: buildRoot(id),
    env: { ...process.env, PORT: String(port), HOST: "127.0.0.1" },
    stdio: "inherit",
  });
  const child = { id, proc, port, coldStartMs: null, lastUsed: Date.now(), exited: false };
  const gone = () => {
    child.exited = true;
    if (children.get(id) === child) children.delete(id);
    if (id === MAIN && !stopping) process.exit(1);
  };
  proc.on("exit", gone);
  proc.on("error", gone);
  child.ready = waitUntilAlive(child).then(() => {
    child.coldStartMs = Math.round(performance.now() - started);
  });
  child.ready.catch(() => {
    if (stopping) return;
    if (id === MAIN) process.exit(1);
    stopBuild(child);
  });
  children.set(id, child);
  trimWarm(id);
  return child;
};

const megabytes = (bytes) => Math.round(bytes / 1048576);

const readMegabytes = (path) => {
  try {
    const value = Number(readFileSync(path, "utf8").trim());
    return Number.isFinite(value) ? megabytes(value) : null;
  } catch {
    return null;
  }
};

const rssOf = (pid) => {
  try {
    const match = readFileSync(`/proc/${pid}/status`, "utf8").match(/VmRSS:\s+(\d+) kB/);
    return match ? Math.round(Number(match[1]) / 1024) : null;
  } catch {
    return null;
  }
};

const page = (res, status, title, body) => {
  res.writeHead(status, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
  res.end(
    `<!doctype html><html lang="nb"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /><title>${title}</title></head><body><main><h1>${title}</h1>${body}</main></body></html>`,
  );
};

const listPage = (req, res) => {
  const current = selected(req);
  const items = buildIds()
    .map((id) => `<li><a href="${CONTROL}/${id}">${id}</a>${id === current ? " (valgt)" : ""}</li>`)
    .join("");
  page(res, 200, "Bygg til test", `<ul>${items}</ul><p><a href="${BASE}/">Åpne Utkast</a></p>`);
};

const missing = (res, id) => {
  const name = VALID_ID.test(id) ? id : "ukjent";
  page(
    res,
    404,
    "Bygget finnes ikke lenger",
    `<p>Bygget «${name}» er fjernet.</p><p><a href="${CONTROL}/${MAIN}">Tilbake til main</a></p>`,
  );
};

const pick = (res, id) => {
  const cookie =
    id === MAIN
      ? `${COOKIE}=; Path=${BASE}; Max-Age=0; HttpOnly; Secure; SameSite=Lax`
      : `${COOKIE}=${id}; Path=${BASE}; Max-Age=1209600; HttpOnly; Secure; SameSite=Lax`;
  res.writeHead(302, { "set-cookie": cookie, location: `${BASE}/`, "cache-control": "no-store" });
  res.end();
};

const diag = (req, res) => {
  const body = {
    node: process.version,
    execPath: process.execPath,
    cwd: ROOT,
    argv: process.argv.slice(1),
    uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
    cluster: process.env.NAIS_CLUSTER_NAME ?? null,
    clientId: process.env.NAIS_CLIENT_ID ?? null,
    tokenExchangeEndpoint: process.env.NAIS_TOKEN_EXCHANGE_ENDPOINT ?? null,
    nodeOptions: process.env.NODE_OPTIONS ?? null,
    hasTokenXKey: Boolean(process.env.TOKEN_X_PRIVATE_JWK),
    heapCapMb: HEAP_MB,
    maxWarm: MAX_WARM,
    memoryMb: {
      containerUsed: readMegabytes("/sys/fs/cgroup/memory.current"),
      containerLimit: readMegabytes("/sys/fs/cgroup/memory.max"),
      launcher: megabytes(process.memoryUsage.rss()),
    },
    selected: selected(req),
    builds: buildIds().map((id) => {
      const child = children.get(id);
      return {
        id,
        dir: buildRoot(id),
        running: Boolean(child),
        pid: child?.proc.pid ?? null,
        coldStartMs: child?.coldStartMs ?? null,
        rssMb: child ? rssOf(child.proc.pid) : null,
        idleSeconds: child ? Math.round((Date.now() - child.lastUsed) / 1000) : null,
      };
    }),
  };
  res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
  res.end(JSON.stringify(body, null, 2));
};

const proxy = (req, res, child) => {
  child.lastUsed = Date.now();
  const upstream = request(
    { host: "127.0.0.1", port: child.port, path: req.url, method: req.method, headers: req.headers },
    (answer) => {
      res.writeHead(answer.statusCode ?? 502, [...answer.rawHeaders, "x-preview-build", child.id]);
      answer.pipe(res);
      answer.on("close", () => {
        if (!answer.complete) res.destroy();
      });
    },
  );
  upstream.on("error", () => {
    if (res.headersSent) return res.destroy();
    res.writeHead(502, { "content-type": "text/plain; charset=utf-8" });
    res.end("Bygget svarer ikke");
  });
  res.on("close", () => upstream.destroy());
  req.pipe(upstream);
};

const handle = async (req, res) => {
  const path = new URL(req.url ?? "/", "http://localhost").pathname;
  if (path === CONTROL || path === `${CONTROL}/`) return listPage(req, res);
  if (path === `${CONTROL}/diag`) return diag(req, res);
  if (path.startsWith(`${CONTROL}/`)) {
    const id = path.slice(CONTROL.length + 1);
    return hasBuild(id) ? pick(res, id) : missing(res, id);
  }
  const wanted = path.includes("/internal/") ? MAIN : selected(req);
  if (!hasBuild(wanted)) return missing(res, wanted);
  const child = startBuild(wanted);
  try {
    await child.ready;
  } catch {
    res.writeHead(502, { "content-type": "text/plain; charset=utf-8" });
    return res.end("Bygget startet ikke");
  }
  proxy(req, res, child);
};

const server = createServer((req, res) => {
  handle(req, res).catch(() => {
    if (!res.headersSent) res.writeHead(500);
    res.end();
  });
});

const stop = () => {
  stopping = true;
  server.close();
  for (const child of [...children.values()]) stopBuild(child);
  setTimeout(() => process.exit(0), 5000).unref();
};

if ((process.env.NAIS_CLUSTER_NAME ?? "").includes("prod")) {
  await import(pathToFileURL(resolve(ROOT, ENTRY)).href);
} else {
  server.listen(PORT, HOST);
  startBuild(MAIN);
  setInterval(
    () => {
      for (const child of [...children.values()]) {
        if (child.id !== MAIN && Date.now() - child.lastUsed > IDLE_MS) stopBuild(child);
      }
    },
    Math.min(IDLE_MS, 60_000),
  ).unref();
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
}
