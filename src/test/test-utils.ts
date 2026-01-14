import { assert } from "chai";

export function assertSubset(subset: unknown, superset: unknown): boolean {
  if (subset === null || subset === undefined) {
    return superset === null || superset === undefined;
  }

  if (typeof subset !== "object") {
    return subset === superset;
  }

  if (typeof superset !== "object" || superset === null) {
    return false;
  }

  if (subset instanceof Date) {
    return superset instanceof Date && subset.valueOf() === superset.valueOf();
  }

  if (Array.isArray(subset)) {
    if (!Array.isArray(superset)) {
      return false;
    }
    return subset.every((subsetItem) => superset.some((supersetItem) => assertSubset(subsetItem, supersetItem)));
  }

  return Object.keys(subset).every((key) => {
    if (!(key in superset)) {
      assert.fail(`Key ${key} not found in superset`);
      return false;
    }

    const subsetValue = (subset as Record<string, unknown>)[key];
    const supersetValue = (superset as Record<string, unknown>)[key];

    return assertSubset(subsetValue, supersetValue);
  });
}
