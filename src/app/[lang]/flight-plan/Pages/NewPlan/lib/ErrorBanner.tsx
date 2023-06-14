import classes from './ErrorBanner.module.css';

export const RouteErrorBanner = ({
  children,
  type = 'error',
}: {
  children: string | string[]
  type?: 'error' | 'warning'
}) => {
  if (Array.isArray(children)) {
    return (
      <>
        {
          children
            .map((c) => (
              <div key={c} className={`${classes.Wrapper} ${type === 'warning' ? classes.Warning : classes.Error}`}>
                <div>
                  Error: {c}
                </div>
              </div>
            ))
        }
      </>
    );
  }
  return (
    <div className={`${classes.Wrapper} ${type === 'warning' ? classes.Warning : classes.Error}`}>
      <div>
        Error: {children}
      </div>
    </div>
  );
};
