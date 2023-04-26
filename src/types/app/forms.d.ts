type IFormData<
Multi extends boolean,
FormData extends IFormData<false> | undefined = undefined
> = Multi extends true
? FormData extends undefined
  ? {[key: string]: string | string[]}
  : {[key in keyof FormData]: string | string[]}
: Multi extends false
? FormData extends undefined
  ? {[key: string]: string}
  : {[key in keyof FormData]: string}
: never;

