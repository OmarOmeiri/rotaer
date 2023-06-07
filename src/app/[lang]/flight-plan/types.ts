export type FlightPlanEditableIds =
| 'altitude'
| 'ias'
| 'wind';

export type UserWaypointAdded = {
  altitude: number | null,
  coords: {decimal: {lat: number, lon: number}, degMinSec: string},
  name: string,
  addAfter: string,
}

export type OnUserWaypointEdit = (index: number, id: FlightPlanEditableIds, value: string) => void;
