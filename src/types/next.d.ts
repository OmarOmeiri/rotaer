type NextRoute = (req: Request) => any

type MyController<C> = {
  [K in keyof C]: NextRoute
}