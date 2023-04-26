type DBQuery<K extends string> = {
  select: K[],
  orderBy?: DBSorting<K>,
  limit?: number,
  page?: number
  filters?: {
    [key in K]?: AllFilterTypes
  }
}

type DBSorting<K extends string = string> = {
  key: K,
  order: 'asc' | 'desc'
}[]
