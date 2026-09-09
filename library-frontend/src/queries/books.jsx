import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
    query {
        allBooks {
            title
            author
            published
            genres
            id
        }
    }
`;

export const ALL_BOOKS_NO_GENRE = gql`
    query {
        allBooks {
            title
            author
            published
            id
        }
    }
`;