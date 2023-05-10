import { WithId } from "mongodb"
import { UserOmitPassword } from "../models/user/userModels"
import { TAerodromeData, TAerodromPrelimInfo } from "./app/aerodrome"

type UserRoutes = {
  logIn: {
    POST: {
      req: IAuthRequest,
      res: IAuthResponse | null
    }
  },
  load: {
    POST: {
      req?: undefined,
      res: UserOmitPassword | null
    }
  },
}

type AircraftRoutes = {
  find: {
    GET: {
      req: {id: string},
      res: WithId<IAcft> | null
    }
  },
}

type AerodromeRoutes = {
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

export type TAPIRoutes = {
  user: UserRoutes,
  aerodrome: AerodromeRoutes,
  acft: AircraftRoutes
}


export type TAPI<Group extends keyof TAPIRoutes, Route extends keyof TAPIRoutes[Group]> = {
  [R in keyof TAPIRoutes[Group][Route]]: (req: MyRequest<TAPIRoutes[Group][Route][R]['req']>) => Promise<TAPIRoutes[Group][Route][R]['res']>
}

export type TRequest<Group extends keyof TAPIRoutes, Route extends keyof TAPIRoutes[Group]> = {
  [R in keyof TAPIRoutes[Group][Route]]: (req: TAPIRoutes[Group][Route][R]['req']) => Promise<TAPIRoutes[Group][Route][R]['res']>
}


