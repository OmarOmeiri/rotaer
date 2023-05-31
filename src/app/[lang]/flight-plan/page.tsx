import { getUserFlightPlans } from '../../../Http/requests/flightPlan';
import FlightPlan from './FlightPlan';

const FlightPlanPage = async () => {
  const userPlans = await getUserFlightPlans(undefined);
  console.log('userPlans: ', userPlans);
  return (
    <FlightPlan userPlans={userPlans}/>
  );
};

export default FlightPlanPage;
