/**
 * CSV for spreadsheets (Excel, Numbers, Google Sheets): every cell is quoted,
 * quotes are doubled, and cells that a spreadsheet would run as a formula
 * (= + - @, tab, carriage return) are prefixed with an apostrophe.
 */
const FORMULA_START = /^[=+\-@\t\r]/

export function csvCell(value: unknown): string {
  let text = value == null ? '' : String(value)
  if (FORMULA_START.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

export function toCsv(rows: unknown[][]): string {
  // BOM so Excel detects UTF-8 (accents, curly quotes); CRLF per RFC 4180.
  return `﻿${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}\r\n`
}
