import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
    query {
        allBooks {
            author {
                name
            }
            title
            published
            genres
            id
        }
    }
`;

export const ALL_BOOKS_NO_GENRE = gql`
    query {
        allBooks {
            author {
                name
            }
            title
            published
            id
        }
    }
`;

export const ALL_BOOKS_BY_GENRE = gql`
    query($genre: String!) {
        allBooks(genre: $genre) {
            author {
                name
            }
            title
            published
            genres
            id
        }
    }
`;
