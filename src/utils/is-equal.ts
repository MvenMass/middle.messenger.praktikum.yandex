type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object' && value !== null && Object.getPrototypeOf(value) === Object.prototype;
}

function isEqualArrays(left: unknown[], right: unknown[]): boolean {
  return left.length === right.length && left.every((item, index) => isEqual(item, right[index]));
}

function isEqualObjects(left: PlainObject, right: PlainObject): boolean {
  const leftKeys = Object.keys(left);
  const hasSameKeys = leftKeys.length === Object.keys(right).length
    && leftKeys.every((key) => Object.hasOwn(right, key));

  return hasSameKeys && leftKeys.every((key) => isEqual(left[key], right[key]));
}

export function isEqual(left: unknown, right: unknown): boolean {
  if (left === right) {
    return true;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    return isEqualArrays(left, right);
  }

  if (isPlainObject(left) && isPlainObject(right)) {
    return isEqualObjects(left, right);
  }

  return false;
}
