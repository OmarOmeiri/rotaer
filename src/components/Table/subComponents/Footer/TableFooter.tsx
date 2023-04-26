import { flexRender, Table } from '@tanstack/react-table';
import { Fragment } from 'react';
import classes from './TableFooter.module.css';

/* eslint-disable require-jsdoc */
type Props<T extends Record<string, unknown>> = {
  table: Table<T>
}

export function TableFooter<T extends Record<string, unknown>>({ table }: Props<T>) {
  return (
    <div className={classes.TFoot}>
      {table.getFooterGroups().map((footerGroup) => (
        <Fragment key={footerGroup.id}>
          {footerGroup.headers.map((header) => (
            <div key={header.id} className={classes.TFootTd} style={{ width: header.getSize() }}>
              {header.isPlaceholder
                ? null
                : flexRender(
                  header.column.columnDef.footer,
                  header.getContext(),
                )}
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  );
}
