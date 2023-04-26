import Logo from '@assets/icons/Logo.svg';

type Props = {
  logoStyle?: React.CSSProperties
}

export const NavLogo = ({ logoStyle }: Props) => (
  <div>
    <Logo style={logoStyle || {}}/>
  </div>
);
