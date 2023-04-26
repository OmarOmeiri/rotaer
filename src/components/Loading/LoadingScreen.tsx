import React from 'react';
import Backdrop from '../Backdrop/Backdrop';
import Spinner from './LoadingSpinner';

type Props = {
  isLoading: boolean
}
const LoadingScreen = ({ isLoading }: Props) => (
  <Backdrop show={isLoading}>
    <Spinner divStyle={{ position: 'unset' }} />
  </Backdrop>
);

export default LoadingScreen;
