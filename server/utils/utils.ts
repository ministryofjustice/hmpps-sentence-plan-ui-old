const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

export const pagination = (
  currentPage: number,
  totalPages: number,
  totalResults: number,
  pathFn: (pageNumber: number) => string,
  maxPagesToShow = 7,
) => {
  const firstPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1)
  const lastPage = Math.min(currentPage + Math.floor(maxPagesToShow / 2), totalPages)
  return {
    totalResults,
    from: (currentPage - 1) * 10 + 1,
    to: Math.min(currentPage * 10, totalResults),
    next: currentPage < totalPages ? pathFn(currentPage + 1) : null,
    prev: currentPage > 1 ? pathFn(currentPage - 1) : null,
    items: [
      ...(firstPage > 1 ? [{ ellipsis: true }] : []),
      ...Array.from({ length: lastPage - firstPage + 1 }, (_, i) => firstPage + i).map(pageNumber => ({
        number: pageNumber,
        current: currentPage === pageNumber,
        href: pathFn(pageNumber),
      })),
      ...(lastPage < totalPages ? [{ ellipsis: true }] : []),
    ],
  }
}
