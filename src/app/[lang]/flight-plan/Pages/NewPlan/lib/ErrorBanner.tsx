import classes from './ErrorBanner.module.css';

export const RouteErrorBanner = ({
  children,
}: {children: string | string[]}) => {
  if (Array.isArray(children)) {
    return (
      <>
        {
          children
            .map((c) => (
              <div key={c} className={classes.Wrapper}>
                Error: {c}
              </div>
            ))
        }
      </>
    );
  }
  return (
    <div className={classes.Wrapper}>
      Error: {children}
    </div>
  );
};
