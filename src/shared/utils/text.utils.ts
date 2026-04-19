/**
 * Normaliza texto removendo acentos, convertendo para minúsculo
 * e removendo espaços extras. Muito útil para buscas e filtros.
 */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/**
 * Retorna os N primeiros caracteres de uma string
 */
export function left(value: string, length: number): string {
  if (!value) return ''
  return value.substring(0, length)
}

/**
 * Retorna os N últimos caracteres de uma string
 */
export function right(value: string, length: number): string {
  if (!value) return ''
  return value.substring(value.length - length)
}

/**
 * Trunca uma string caso ultrapasse o tamanho máximo
 * e adiciona "..." no final.
 */
export function truncateText(value: string | null | undefined, maxLength: number): string {

  if (!value) return ''

  if (value.length <= maxLength) {
    return value
  }

  return value.substring(0, maxLength).trimEnd() + '...'
}

/**
 * Trunca uma string caso ultrapasse o tamanho máximo
 * e adiciona "..." no final, porém, sem cortar a palavra.
 */
export function truncateTextElegant(value: string | null | undefined, maxLength: number): string {

  if (!value) return ''

  if (value.length <= maxLength) {
    return value
  }

  const truncated = value.substring(0, maxLength)

  const lastSpace = truncated.lastIndexOf(' ')

  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...'
  }

  return truncated + '...'
}
