/** Shared class constants — see design-system/restaurante-progra/MASTER.md */
export const panelClass = 'app-panel'
export const formSectionClass = 'app-form-section'
export const inputClass = 'app-input'
export const selectClass = 'app-select'
export const tableWrapClass = 'app-table-wrap'
export const tableClass = 'app-table'

/** Convert ISO datetime string to datetime-local input value (strips seconds) */
export const toDateTimeLocal = (iso: string): string =>
  iso ? iso.slice(0, 16) : ''

/** Convert datetime-local input value back to ISO-like string with seconds */
export const fromDateTimeLocal = (val: string): string =>
  val.length === 16 ? `${val}:00` : val
