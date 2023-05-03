import classes from './MetarStatusBadge.module.css';

const colors = {
  IMC: '#ea6d6d',
  VMC: '#43b843',
};

const MetarStatusBadge = ({ status }: {status: 'IMC' | 'VMC'}) => (
  <div className={classes.Badge} style={{ backgroundColor: colors[status] }}>
    <span>{status}</span>
  </div>
);

export default MetarStatusBadge;
