import { ALL_BOOKS } from '../queries/books'

export const addBooksToCache = (cache, bookToAdd) => {
  cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
    const bookExists = allBooks.some(
      (book) => book.id === bookToAdd.id,
    )

    if (bookExists) {
      return { allBooks }
    }

    return {
      allBooks: allBooks.concat(bookToAdd),
    }
  })
}