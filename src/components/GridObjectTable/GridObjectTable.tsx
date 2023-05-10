import { Fragment } from 'react';
import classes from './GridObjectTable.module.css';

const GridObjectTable = <T extends object>({
  obj,
  className,
  keyFormatter,
  valueFormatter,
  omit,
}: {
  obj: T
  className?: string,
  keyFormatter?: <K extends keyof T>(key: K, value: T[K]) => string,
  valueFormatter?: <K extends keyof T>(key: K, value: T[K]) => string | number,
  omit?: <K extends keyof T>(key: K, value: T[K]) => boolean,
}) => (
  <div className={`${classes.Grid} ${className || ''}`}>
    {
      Object.entries(obj).reduce((nodes, [k, v]) => {
        if (omit && omit(k as keyof T, v)) {
          return nodes;
        }
        nodes.push(
          <Fragment key={k}>
            <div>{keyFormatter ? keyFormatter(k as keyof T, v) : String(k)}</div>
            <div>{valueFormatter ? valueFormatter(k as keyof T, v) : String(v)}</div>
          </Fragment>,
        );
        return nodes;
      }, [] as JSX.Element[])
    }
  </div>
  );

export default GridObjectTable;
