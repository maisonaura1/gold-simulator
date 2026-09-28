export interface FoundPhone {
  /** Digits with the country code, as wa.me links need them. */
  digits: string
  /** The number as the sender wrote it. */
  display: string
}

/**
 * Finds the first international phone number written in a free-text message
 * ("+33 6 12 34 56 78", "0049 170 1234567"). Local numbers without a country
 * code are ignored because the country can't be guessed.
 */
export function findPhoneNumber(text: string): FoundPhone | null {
  const candidates = text.match(/(?:\+|\b00)\s?\d[\d\s().-]{5,20}\d/g) ?? []
  for (const candidate of candidates) {
    const display = candidate.trim()
    const all = display.replace(/\D/g, '')
    const digits = display.startsWith('00') ? all.slice(2) : all
    if (digits.length >= 8 && digits.length <= 15) return { digits, display }
  }
  return null
}

export function whatsappLink(digits: string, message?: string): string {
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}
