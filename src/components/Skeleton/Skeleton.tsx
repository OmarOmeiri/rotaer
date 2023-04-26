import * as React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import MuiSkeleton, { SkeletonProps } from '@mui/material/Skeleton';

type Props = {
  box?: BoxProps,
  skeleton?: SkeletonProps
}

export const Skeleton = ({
  box,
  skeleton,
}: Props) => (
  <Box {...(box || {})}>
    <MuiSkeleton
    {...skeleton}
      animation={skeleton?.animation || 'wave'}
      sx={{
        transform: 'unset',
        ...(skeleton?.sx || {}),
      }}
    />
  </Box>
);
