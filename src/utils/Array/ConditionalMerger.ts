import { cloneDeep } from 'lodash';

type InsertMutator<T2, T3> = (elementToInsert: T2) => T3;

class ConditionalMerger<T1, T2> {
  private offset = 0;

  constructor(
    private arr1: T1[],
    private arr2: T2[],
    private cb: (e1: T1, e2: T2) => boolean,
  ) {}

  insertOffset(offset: number) {
    this.offset = offset;
  }

  merge<T3>(mutator: InsertMutator<T2, T3>): Array<T1|T3>
  merge(mutator?: undefined): Array<T1|T2>
  merge<T3>(mutator?: InsertMutator<T2, T3>): Array<T1|T3> | Array<T1|T2> {
    const toInsert = cloneDeep(this.arr2);
    const merged = cloneDeep(this.arr1) as Array<T1|T2|T3>;
    let loopCount = 0;
    const loopLimit = Math.max(toInsert.length * merged.length, 10);
    while (toInsert.length) {
      let index = 0;
      for (const e1 of merged) {
        let innerIndex: number | null = null;
        const found = toInsert.find((e2, i) => {
          const result = this.cb(e1 as T1, e2);
          if (result) innerIndex = i;
          return result;
        });
        if (found && typeof innerIndex === 'number') {
          const elementToInsert = mutator ? mutator(found) : found;
          merged.splice(index + this.offset, 0, elementToInsert);
          toInsert.splice(innerIndex, 1);
        }
        loopCount += 1;
        index += 1;
      }
      if (loopCount >= loopLimit) {
        throw new Error('Max recursion limit reached.');
      }
    }
    return merged as Array<T1|T2> | Array<T1|T3>;
  }
}

export default ConditionalMerger;
