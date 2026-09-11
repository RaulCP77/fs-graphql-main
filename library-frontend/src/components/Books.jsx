import { useQuery } from '@apollo/client/react'
import { useState } from 'react'
import { ALL_BOOKS, ALL_BOOKS_BY_GENRE } from '../queries/books.jsx'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const query = genre ? ALL_BOOKS_BY_GENRE : ALL_BOOKS
  const data = useQuery(query, {
    variables: genre ? { genre } : {},
    fetchPolicy: 'network-only',
  })

  if (!props.show) {
    return null
  }

  if (data.loading) {
    return <div>loading...</div>
  }

  const books = data.data.allBooks
  const genres = [...new Set(books.flatMap((book) => book.genres))]

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            {genre ?(
                <td>
                  Showing in genre <strong>{genre}</strong>
                </td>
              ): (
                <td>Showing all genres</td>
              )}
            <td>
              <button onClick={() => setGenre(null)}>all genres</button>
            </td>
          </tr>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) =>
            genre === null || book.genres.includes(genre) ? (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
      <h3>By genre</h3>
      <ul>
        {genres.map((genre) => (
          <li key={genre}>
            <button onClick={() => setGenre(genre)}>{genre}</button>
          </li>
        ))}
      </ul>
    </div>  
  )
}

export default Books
