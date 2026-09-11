import { useState } from 'react'
import { useMutation, useApolloClient } from '@apollo/client/react'
import { LOGIN, ME } from '../queries/user.jsx'

const Login = ({ show, token, setError, setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  const client = useApolloClient()

  const [login] = useMutation(LOGIN, {
    onError: (error) => {
      setError("login failed: " + error.message)
    },
  })

  const submit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const { data } = await login({
        variables: { username, password },
      })

      const newToken = data.login.value

      localStorage.setItem('library-user-token', newToken)
      setToken(newToken)

      await client.refetchQueries({
        include: [ME],
      })
    } catch (error) {
      setError('login failed: ' + error.message)
    }
  }

  if (!show) {
    return null
  }
  return (
    <div>
      <h2>login</h2>
      {!token ? (
        <form onSubmit={submit}>
          <div>
            <label htmlFor="username">username{' '}</label>
            <input
              id="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">password </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form> 
      ) : (
        <p>logged in as {username}</p>
      )   
      }
    </div>
  )
}

export default Login