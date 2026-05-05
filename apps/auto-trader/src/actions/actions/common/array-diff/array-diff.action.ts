import getValue from '../../../utils/get-value.util';
import type { ActionError } from '../../../types/action-error';

export default function array_diff(
  args: any,
  {
    sequenceContext,
  }: {
    sequenceContext: any;
  }
): void {
  const { left, right, compareKey } = args;
  const returnKeyOnly = args?.returnKeyOnly === true;

  let { resultKey } = args;
  if (!resultKey) {
    resultKey = 'array_diff';
  }

  if (!left) {
    sequenceContext.set(resultKey, {
      error: { message: 'array_diff: "left" is required' },
    } satisfies ActionError);
    return;
  }

  if (!right) {
    sequenceContext.set(resultKey, {
      error: { message: 'array_diff: "right" is required' },
    } satisfies ActionError);
    return;
  }

  let leftArr = getValue(String(left), { heap: this.heap, sequenceContext });
  const rightArr = getValue(String(right), { heap: this.heap, sequenceContext });

  if (leftArr === undefined || leftArr === null) {
    leftArr = [];
  }

  if (!Array.isArray(leftArr) || !Array.isArray(rightArr)) {
    sequenceContext.set(resultKey, {
      error: {
        message: 'array_diff: both left and right must resolve to arrays',
        details: {
          leftType: Array.isArray(leftArr) ? 'array' : typeof leftArr,
          rightType: Array.isArray(rightArr) ? 'array' : typeof rightArr,
        },
      },
    } satisfies ActionError);
    return;
  }

  if (compareKey) {
    const key = String(compareKey);

    const leftKeys = new Set(
      leftArr
        .map((v) => (v && typeof v === 'object' ? (v as any)[key] : undefined))
        .filter((v) => v !== undefined && v !== null)
        .map((v) => String(v))
    );

    const diffItems = rightArr.filter((v) => {
      if (!v || typeof v !== 'object') return false;
      const k = (v as any)[key];
      if (k === undefined || k === null) return false;
      return !leftKeys.has(String(k));
    });

    if (returnKeyOnly) {
      sequenceContext.set(resultKey, diffItems.map((v) => String((v as any)[key])));
      return;
    }

    sequenceContext.set(resultKey, diffItems);
    return;
  }

  const leftSet = new Set(leftArr.map((v) => String(v)));
  const diff = rightArr.filter((v) => !leftSet.has(String(v)));

  sequenceContext.set(resultKey, diff);
}
