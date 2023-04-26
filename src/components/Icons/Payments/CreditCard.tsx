import React from 'react';

interface ICreditCardIconProps {
  width?: number
  fill?: string,
}

const CreditCardIcon: React.FC<ICreditCardIconProps> = ({
  width = 50,
  fill,
}) => (
  <svg width={width} height={width} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
    {/* <path d="M527.9 32H48.1C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48.1 48h479.8c26.6 0 48.1-21.5 48.1-48V80c0-26.5-21.5-48-48.1-48zM54.1 80h467.8c3.3 0 6 2.7 6 6v42H48.1V86c0-3.3 2.7-6 6-6zm467.8 352H54.1c-3.3 0-6-2.7-6-6V256h479.8v170c0 3.3-2.7 6-6 6zM192 332v40c0 6.6-5.4 12-12 12h-72c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12zm192 0v40c0 6.6-5.4 12-12 12H236c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h136c6.6 0 12 5.4 12 12z" /> */}
    <path fill={fill ?? 'currentColor'} d="M498.5,470.3H77.5C34.7,470.3,0,435.6,0,392.9V119.1c0-42.7,34.7-77.5,77.5-77.5h421.1c42.7,0,77.5,34.7,77.5,77.5v273.7 C576,435.6,541.3,470.3,498.5,470.3z M77.5,70.3c-27,0-48.9,21.9-48.9,48.9v273.7c0,27,21.9,48.9,48.9,48.9h421.1 c27,0,48.9-21.9,48.9-48.9V119.1c0-27-21.9-48.9-48.9-48.9H77.5z M218.1,371.8c0-7.9-6.4-14.3-14.3-14.3H98.5 c-7.9,0-14.3,6.4-14.3,14.3s6.4,14.3,14.3,14.3h105.3C211.7,386.1,218.1,379.7,218.1,371.8z M365.5,371.8c0-7.9-6.4-14.3-14.3-14.3 H245.9c-7.9,0-14.3,6.4-14.3,14.3s6.4,14.3,14.3,14.3h105.3C359.1,386.1,365.5,379.7,365.5,371.8z M512.8,371.8 c0-7.9-6.4-14.3-14.3-14.3H393.3c-7.9,0-14.3,6.4-14.3,14.3s6.4,14.3,14.3,14.3h105.3C506.4,386.1,512.8,379.7,512.8,371.8z M512.8,140.2c0-7.9-6.4-14.3-14.3-14.3h-42.1c-7.9,0-14.3,6.4-14.3,14.3c0,7.9,6.4,14.3,14.3,14.3h42.1 C506.4,154.5,512.8,148.1,512.8,140.2z M203.8,259.8H98.5c-7.9,0-14.3-6.4-14.3-14.3V140.2c0-7.9,6.4-14.3,14.3-14.3h105.3 c7.9,0,14.3,6.4,14.3,14.3v105.3C218.1,253.4,211.7,259.8,203.8,259.8z M112.8,231.2h76.7v-76.7h-76.7V231.2z" />
  </svg>
);

export default CreditCardIcon;