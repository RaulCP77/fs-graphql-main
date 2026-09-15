import { useState } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client/react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommended from './components/Recommended'
import { BOOK_ADDED } from './queries/books'
import { addBooksToCache } from './utils/apolloCache'

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem('library-user-token'))
  const [page, setPage] = useState('authors')
  const [error, setError] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log("Subscription result:", data);

      const addedBook = data.data?.bookAdded;

      if (addedBook) {
        window.alert(`${addedBook.title} added`);
      }
      addBooksToCache(client.cache, addedBook)
    },

    onError: (error) => {
      console.error("Subscription error:", error);
    },
  });
  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token === null ? (
          <button onClick={() => setPage('login')}>login</button>
        ) : (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button name="recommend" onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={onLogout}>logout</button>
          </>
        )}

      </div>
      
      <div>{error && <p style={{ color: 'red' }}>{error}</p>}</div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />
     
      <NewBook show={page === 'add'} />

      <Recommended show={page === 'recommend'} />

      <Login show={page === 'login'} token={token} setToken={setToken} setError={setError} />

    </div>
  )
}

export default App
