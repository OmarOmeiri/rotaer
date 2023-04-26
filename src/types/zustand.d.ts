type ZuSet<T> = (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean | undefined, action?: any) => void

type ZuGet<T> = () => T
