export type ID = string

export interface BaseEntity {
  id: ID
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface BreadcrumbItem {
  title: string
  href?: string
}

export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface SelectOption {
  label: string
  value: string
}
