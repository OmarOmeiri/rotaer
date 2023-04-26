import { Skeleton } from './Skeleton';

const WithSkeleton = ({
  children,
  ready,
  skeletonProps,
  style,
  className,
}:{
  children: React.ReactNode
  ready: boolean,
  skeletonProps?: Exclude<Parameters<typeof Skeleton>, undefined>[number]
  style?: React.CSSProperties,
  className?: string
}) => {
  if (!ready) {
    return (
      <div style={style} className={className || ''}>
        <Skeleton
          box={{
            ...(skeletonProps?.box),
            sx: {
              width: '100%',
              height: '100%',
              ...(skeletonProps?.box?.sx || {}),
            },
          }}
          skeleton={{
            ...(skeletonProps?.skeleton),
            sx: {
              width: '100%',
              height: '100%',
              ...(skeletonProps?.skeleton?.sx || {}),
            },
          }}
        />
      </div>
    );
  }

  return (
    <>
      {children}
    </>
  );
};

export default WithSkeleton;
