import Config from '../../config';
import langStore from '../../store/lang/langStore';
import classes from './AssetBadge.module.css';

const aerodromeColors = Config.get('styles').colors.aerodromes;

const getBadge = (key: string) => {
  if (key in aerodromeColors) return aerodromeColors[key as keyof typeof aerodromeColors];
  return aerodromeColors.other;
};

const AssetTypeBadge = ({ type }: {type: string}) => {
  const { lang } = langStore.getState();
  return (
    <div className={classes.Badge} style={{ backgroundColor: getBadge(type).color }}>
      <span>{getBadge(type).content[lang]}</span>
    </div>
  );
};

export default AssetTypeBadge;
