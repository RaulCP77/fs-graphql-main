import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS_NO_GENRE } from '../queries/books.jsx'

const Books = (props) => {
  const data = useQuery(ALL_BOOKS_NO_GENRE)

  if (!props.show) {
    return null
  }

  if (data.loading) {
    return <div>loading...</div>
  }

  const books = data.data.allBooks

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
