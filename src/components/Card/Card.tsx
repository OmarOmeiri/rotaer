import classes from './Card.module.css';

type Props = {
  children: JSX.Element
  className?: string
}

const Card = ({ children, className }: Props) => (
  <div className={`${classes.Card} ${className || ''}`}>
    {children}
  </div>
);

export default Card;
