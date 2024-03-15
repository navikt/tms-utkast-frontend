interface Props {
  url: string;
  options?: object;
}

export const include = {
  credentials: "include",
};

export const fetcher = async ({ url, options }: Props) => {
  const response = await fetch(url, {
    method: "GET",
    ...options,
  });

  if (!response.ok) {
    throw new Error("Fetch request failed");
  }

  return response.json().then((jsonData) => {
    return { statusCode: response.status, data: jsonData };
  });;
};