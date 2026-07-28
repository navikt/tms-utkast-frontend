export const fetchUtkast = async (oboToken: string, url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${oboToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Http error with status: ${response.status}`);
  }

  return await response.json();
};
