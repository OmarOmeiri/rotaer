import { TAerodromeData, TAerodromPrelimInfo } from "./app/aerodrome"

export type TAPIRoutes = {
  find: {
    GET: {
      req: {id: string},
      res: TAerodrome[],
      verb: 'GET'
    }
  }
  coordinates: {
    GET: {
      req?: {id: string},
      res: TAerodromPrelimInfo[],
      verb: 'GET'
    }
  }
  info: {
    GET: {
      req: {id: string},
      res: TAerodromeData | null,
      verb: 'GET'
    }
  }
}


export type TAPI<Group extends keyof TAPIRoutes> = {
  [Route in keyof TAPIRoutes[Group]]: (req: MyRequest<TAPIRoutes[Group][Route]['req']>) => Promise<TAPIRoutes[Group][Route]['res']>
}

export type TFetch<Group extends keyof TAPIRoutes> = {
  [Route in keyof TAPIRoutes[Group]]: (req: TAPIRoutes[Group][Route]['req']) => Promise<TAPIRoutes[Group][Route]['res']>
}