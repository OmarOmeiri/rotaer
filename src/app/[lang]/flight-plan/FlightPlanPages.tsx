import { FlightPlan } from '../../../types/app/fPlan';
import MyAcft from './Pages/MyAcft';
import MyPlans from './Pages/MyPlans';
import NewPlan from './Pages/NewPlan';

const FlightPlanPages = ({
  page,
  userPlans,
}: {
  page: string
  userPlans: FlightPlan[]
}) => {
  switch (page) {
    case 'myPlans':
      return <MyPlans plans={userPlans}/>;
    case 'newPlan':
      return <NewPlan/>;
    case 'myAcft':
      return <MyAcft/>;
    default:
      return null;
  }
};

export default FlightPlanPages;
