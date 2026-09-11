import { useQuery } from '@apollo/client/react'
import { ALL_AUTHORS } from '../queries/authors.jsx'
import { EDIT_AUTHOR } from '../mutations/authors.jsx'
import { useState } from 'react'
import { useMutation } from '@apollo/client/react'

const Authors = (props) => {
  const token = localStorage.getItem('library-user-token')
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const data  = useQuery(ALL_AUTHORS)
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  if (!props.show) {
    return null
  }
  if (data.loading) {
    return <div>loading...</div>
  }
  const authors = data.data.allAuthors

  const submit = async (event) => {
    event.preventDefault()
    console.log('edit author...')

    editAuthor({
      variables: { name, setBornTo: parseInt(born) },
    })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {token === null ? null : (
        <div>
          <h3>Set birthyear</h3>
          <form onSubmit={submit}>
            <div>
              <select name="name" value={name} onChange={({ target }) => setName(target.value)}>
                <option value="">Select author</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="born">born</label> <input id="born" type="number" value={born} onChange={({ target }) => setBorn(target.value)} />
            </div>
            <button type="submit">update author</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Authors