import CardWithTitle from '../../../../components/Card/CardWithTitle';
import Translator from '../../../../utils/Translate/Translator';
import FlightPlanTable from '../components/FlightPlanTable';
import classes from '../styles/FlightPlan.module.css';

const translator = new Translator({
  myPlans: { 'en-US': 'My plans', 'pt-BR': 'My plannings' },
});

const MyPlans = () => (
  <div>
    <CardWithTitle title={translator.translate('myPlans')} styled>
      <FlightPlanTable/>
    </CardWithTitle>
  </div>
);

export default MyPlans;
