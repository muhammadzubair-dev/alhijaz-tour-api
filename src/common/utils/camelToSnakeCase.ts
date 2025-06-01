/**
 * Mengubah string camelCase menjadi snake_case.
 * Bisa mengecualikan string tertentu agar tidak diubah.
 *
 * @param str - String yang ingin dikonversi
 * @param excludeList - Array berisi string yang tidak boleh diubah
 * @returns string dalam snake_case (atau tetap jika masuk ke excludeList)
 */
export function camelToSnakeCase(
  str: string,
  excludeList: string[] = [],
): string {
  if (excludeList.includes(str)) {
    return str;
  }

  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2') // pisah huruf kecil diikuti huruf kapital
    .replace(/[\s\-]+/g, '_') // ganti spasi atau strip jadi underscore
    .toLowerCase();
}
