declare global {
  var arrayOfUnion = <T>() => <U extends T[]>(
    array: U & ([T] extends [U[number]] ? unknown : 'Invalid')
  ) => array;
}

export {};


