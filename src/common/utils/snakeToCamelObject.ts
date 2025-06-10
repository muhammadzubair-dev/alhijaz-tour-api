function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function isPlainObject(obj: any): obj is Record<string, any> {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function snakeToCamelObject(input: any): any {
  if (input === null || input === undefined) {
    return input; // langsung kembalikan null/undefined tanpa proses
  }

  if (Array.isArray(input)) {
    return input.map(snakeToCamelObject);
  } else if (isPlainObject(input)) {
    return Object.keys(input).reduce((acc: any, key) => {
      const camelKey = toCamelCase(key);
      acc[camelKey] = snakeToCamelObject(input[key]);
      return acc;
    }, {});
  } else {
    return input;
  }
}

export default snakeToCamelObject;
