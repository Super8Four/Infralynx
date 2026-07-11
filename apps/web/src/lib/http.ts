export async function api<T>(
  url: string,
  init: RequestInit | undefined,
  parse: (value: unknown) => T,
) {
  const response = await fetch(url, init);
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: { message?: string };
    } | null;
    throw new Error(
      payload?.error?.message ??
        `Request failed with status ${response.status}.`,
    );
  }
  return parse(await response.json());
}
