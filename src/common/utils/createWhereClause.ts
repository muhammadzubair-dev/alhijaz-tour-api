/**
 * Membuat objek filter dengan menghapus properti yang nilainya undefined.
 * @param obj Objek input yang mungkin berisi nilai undefined.
 * @returns Objek baru yang hanya berisi properti dengan nilai yang tidak undefined.
 */
export function createWhereClause<T extends Record<string, any>>(
  obj: T,
): Partial<T> {
  return Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(obj).filter(([_, value]) => value !== undefined),
  ) as Partial<T>;
}
