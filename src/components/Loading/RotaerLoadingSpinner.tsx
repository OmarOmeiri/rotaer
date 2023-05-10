import classes from './RotaerLoadingSpinner.module.css';

const RotaerLoadingSpinner = (props: React.SVGProps<SVGSVGElement>) => (
  <svg className={`${props.className ? props.className : ''} ${classes.Spinner}`} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" xmlSpace="preserve" {...props}>
    <path className={classes.WithFill} d="M25,2.9c12.1,0,22,9.9,22,22s-9.9,22-22,22S3,37.1,3,25S12.9,2.9,25,2.9 M25-0.1C11.2-0.1,0,11.1,0,25s11.2,25,25,25s25-11.2,25-25S38.8-0.1,25-0.1L25-0.1z"/>
    <path className={classes.WithFill} d="M32.9,21.7c0,1.3-0.5,2.4-1.2,3.3L50,25C50,11.2,38.8,0,25,0v15.9c2.7,0,4.7,0.5,6,1.6C32.2,18.4,32.9,19.9,32.9,21.7z"/>
    <path className={classes.WithFill} d="M28.4,22.1c0-1.8-1.3-2.8-3.3-2.8c0,0,0,0,0,0v1.2V25h0C27.1,24.9,28.4,23.8,28.4,22.1z"/>
    <path className={classes.WithFill} d="M24.1,25h0.7c0.1,0,0.2,0,0.2,0v0L24.1,25z"/>
    <path className={classes.WithFill} d="M23,28.3v7.9h-4.5V25.1l-0.8,0L0,25c0,13.8,11.2,25,25,25V28.3c-0.2,0-0.4,0-0.7,0H23z"/>
    <path className={classes.WithFadedFill} d="M23,25v-5.5c0.3-0.1,0.9-0.1,2-0.2v-3.4c-0.2,0-0.3,0-0.5,0c-2.4,0-4.6,0.2-6,0.4v8.7l5.6-0.1H23z"/>
    <path className={classes.WithFadedFill} d="M29.3,26.7L29.3,26.7c0.8-0.4,1.7-1,2.4-1.8L25,25c0,0,0,0,0,0v3.3c1.4,0.2,2.1,1,2.6,3.2c0.6,2.5,1.1,4.1,1.4,4.7h4.6c-0.4-0.8-1-3.4-1.6-5.7C31.5,28.6,30.7,27.3,29.3,26.7z"/>
  </svg>

);

export default RotaerLoadingSpinner;
