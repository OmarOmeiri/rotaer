import { TAerodromeData, TAerodromPrelimInfo } from "./app/aerodrome"
import { NextRequest } from "next/server"
import { WithStrId } from "./app/mongo"

type UserRoutes = {
  load: {
    POST: {
      req?: undefined,
      res: UserOmitPassword | null
    }
  },
  create: {
    POST: {
      req: NativeAuthRequest,
      res: IAuthResponse | null
    }
  },
}

type AuthRoutes = {
  authenticate: {
    POST: {
      req: NativeAuthRequest,
      res: IAuthResponse | null
    }
  },
  gAuth: {
    POST: {
      req: GoogleAuthRequest,
      res: IAuthResponse | null
    }
  },
}

type AircraftRoutes = {
  find: {
    GET: {
      req: {id: string},
      res: WithStrId<IAcft> | null
    }
  },
  save: {
    POST: {
      req: {id: string},
      res: any
    }
  },
  findUserAcft: {
    GET: {
      req: {userId: string},
      res: WithStrId<IUserAcft>[]
    }
  },
  deleteUserAcft: {
    DELETE: {
      req: {acftId: string},
      res: null
    }
  },
  editUserAcft: {
    PATCH: {
      req: WithStrId<IUserAcft>,
      res: null
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
  acft: AircraftRoutes,
  auth: AuthRoutes,
}


export type TAPI<Group extends keyof TAPIRoutes, Route extends keyof TAPIRoutes[Group]> = {
  [R in keyof TAPIRoutes[Group][Route]]: (req: MyRequest<TAPIRoutes[Group][Route][R]['req']>) => Promise<TAPIRoutes[Group][Route][R]['res']>
}

export type TRequest<Group extends keyof TAPIRoutes, Route extends keyof TAPIRoutes[Group]> = {
  [R in keyof TAPIRoutes[Group][Route]]: (req: TAPIRoutes[Group][Route][R]['req']) => Promise<TAPIRoutes[Group][Route][R]['res']>
}


