import { useQuery } from '@apollo/client/react'
import { ME } from '../queries/user.jsx'
import { ALL_BOOKS } from '../queries/books.jsx'

const Recommended = (props) => {
    const {
    data: meData,
    loading: meLoading,
    error: meError,
    } = useQuery(ME)
    const {
        data: booksData,
        loading: booksLoading,
        error: booksError,
    } = useQuery(ALL_BOOKS)

    if (!props.show) {
        return null
    }

    if (meLoading || booksLoading) {
        return <div>loading...</div>
    }
 
    if (meError) {
        return <div>Error loading user: {meError.message}</div>
    }

    if (booksError) {
        return <div>Error loading books: {booksError.message}</div>
    }

    if (!meData?.me) {
        return <div>You must be logged in to see recommendations.</div>
    }   

    const favoriteGenre = meData.me.favoriteGenre
    const books = booksData?.allBooks ?? []

    const recommendedBooks = books.filter((book) =>
        book.genres.includes(favoriteGenre)
    )

    return (
        <div>
            <h2>Recommendations</h2>
            <p>Your favorite genre is: <span>{favoriteGenre}</span></p>
            {recommendedBooks.length === 0 ? (<p>No books in your favorite genre</p>
            ):
            <>
            <p>Books in your favorite genre:</p>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {recommendedBooks.map((a) => (
                        <tr key={a.title}>
                            <td>{a.title}</td>
                            <td>{a.author.name}</td>
                            <td>{a.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </>
            }
        </div>
    )
}

export default Recommended