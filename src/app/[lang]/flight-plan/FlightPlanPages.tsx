import MyAcft from './Pages/MyAcft';
import MyPlans from './Pages/MyPlans';
import NewPlan from './Pages/NewPlan';

const FlightPlanPages = ({
  page,
}: {
  page: string
}) => {
  switch (page) {
    case 'myPlans':
      return <MyPlans/>;
    case 'newPlan':
      return <NewPlan/>;
    case 'myAcft':
      return <MyAcft/>;
    default:
      return null;
  }
};

export default FlightPlanPages;
