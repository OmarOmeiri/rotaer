import { ObjectId } from "mongodb"
import { IAerodromeSchema } from "./aerodrome"
import { WithStrId } from "./mongo"

type FlightPlan = {
  name: string,
  acft: WithStrId<IUserAcft>,
  dep: WithStrId<IAerodromeSchema>,
  arr: WithStrId<IAerodromeSchema>,
  createdAt: Date
}

type IFlightPlanSchema = Omit<
FlightPlan,
'acft'
| 'userId'
| 'dep'
| 'arr'
> & {
  acft: ObjectId,
  userId: ObjectId,
  dep: ObjectId,
  arr: ObjectId,
}