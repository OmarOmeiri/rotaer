import { ObjectId } from "mongodb"
import { IAerodromeSchema } from "./aerodrome"
import { WithStrId } from "./mongo"
import { TWaypoint } from "../../utils/Route/Route"

type FlightPlan = {
  name: string,
  dep: WithStrId<IAerodromeSchema>,
  arr: WithStrId<IAerodromeSchema>,
  alt?: WithStrId<IAerodromeSchema>,
  route: TWaypoint[]
  createdAt: Date
}

type SaveFlightPlan = {
  name: string,
  dep: string,
  arr: string,
  alt?: string,
  route: TWaypoint[]
}

type IFlightPlanSchema = Expand<Omit<
FlightPlan,
| 'userId'
| 'dep'
| 'arr'
| 'alt'
> & {
  userId: ObjectId,
  dep: string,
  arr: string,
  alt?: string,
}>