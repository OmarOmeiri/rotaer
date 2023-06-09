import CardWithTitle from '../../../../../components/Card/CardWithTitle';
import Translator from '../../../../../utils/Translate/Translator';
import FlightPlanTable from './lib/FlightPlanTable';
import classes from './MyPlans.module.css';

const translator = new Translator({
  myPlans: { 'en-US': 'My plans', 'pt-BR': 'My plannings' },
});

const MyPlans = () => (
  <div>
    <CardWithTitle title={translator.translate('myPlans')} contentClassName={classes.MyPlansTable} styled>
      <FlightPlanTable/>
    </CardWithTitle>
  </div>
);

export default MyPlans;
