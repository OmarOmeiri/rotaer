type TableFiltersEventHandler = (
  e: React.ChangeEvent<HTMLInputElement>
  | RangeSliderEvent
  | ListSelectEvent
) => void

type TableColTypes =
'text'
| 'number'
| 'catg'
| 'date'

type TableCols<T> = Expand<
  Omit<PartialK<DBColumnTypesWithStats<T>, 'stats'>, 'type' | 'enumValues' | 'name'> & {
    key: keyof Required<T>,
    name: string,
    type?: TableColTypes
    unique?: (string | boolean)[] | null
  }
>

type TextFilter = {
  type: 'text',
  value: string | null
}

type NumericFilter = {
  type: 'number',
  value: ({min: number | null, max: number | null}) | null
}

type CategoricalFilter = {
  type : 'catg'
  value: (string | boolean)[] | null
}

type ColumnsAppliedFilters<T> = {
  [K in keyof T]: boolean
}

type AllFilterValueTypes =
| TextFilter['value']
| NumericFilter['value']
| CategoricalFilter['value']

type AllFilterTypes =
| TextFilter
| NumericFilter
| CategoricalFilter

type FilterValues<T> = {
  [K in keyof T]: AllFilterValueTypes
}

type TableFilters<T> = {
  [K in keyof T]: AllFilterTypes
}

type TableColumnPresets = {
  [k: string]: {
    name: string;
    preset: DBQuery<any>;
  };
}
