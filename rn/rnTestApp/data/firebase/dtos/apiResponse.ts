export type ApiOk<T> = { ok: true; data: T };
export type ApiFail = { ok: false; code?: string; message?: string };
export type ApiResponse<T> = ApiOk<T> | ApiFail;

export function requireData<T>(res: ApiResponse<T>): T {
  if (!res.ok) {
    throw new Error(res.message ?? `Greška (${res.code ?? "ERROR"}).`);
  }
  if (res.data === undefined || res.data === null) {
    throw new Error("Neispravan response: nema data.");
  }
  return res.data;
}

export function asApiResponse<T>(raw: unknown): ApiResponse<T> {
  return raw as ApiResponse<T>;
}
