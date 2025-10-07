export type Rating = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17'

export interface Film {
  id: string
  title: string
  year: number
  rating?: Rating
}
