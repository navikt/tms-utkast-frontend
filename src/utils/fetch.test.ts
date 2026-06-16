import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchUtkast } from "./fetch";

describe("fetchUtkast", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return parsed json on a successful response", async () => {
    const payload = [{ tittel: "Søknad", utkastId: "1" }];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => payload,
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchUtkast("token-123", "https://api.test/utkast");

    expect(result).toEqual(payload);
  });

  it("should send a bearer authorization header with the obo token", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [],
    });
    vi.stubGlobal("fetch", fetchMock);

    await fetchUtkast("token-123", "https://api.test/utkast");

    expect(fetchMock).toHaveBeenCalledWith("https://api.test/utkast", {
      method: "GET",
      headers: { Authorization: "Bearer token-123" },
    });
  });

  it("should throw with the status code when the response is not ok", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({}),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      fetchUtkast("token-123", "https://api.test/utkast"),
    ).rejects.toThrow("Http error with status: 503");
  });
});
