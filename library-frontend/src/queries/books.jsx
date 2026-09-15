import { gql } from '@apollo/client'

const AUTHOR_DETAILS = gql`
    fragment AuthorDetails on Author {
        name
    }
`
export const ALL_BOOKS = gql`
    query {
        allBooks {
            author {
            ...AuthorDetails
            }
            title
            published
            genres
            id
        }
    }
    ${AUTHOR_DETAILS}
`;

export const ALL_BOOKS_NO_GENRE = gql`
    query {
        allBooks {
            author {
                ...AuthorDetails
            }
            title
            published
            id
        }
    }
    ${AUTHOR_DETAILS}
`;

export const ALL_BOOKS_BY_GENRE = gql`
    query($genre: String!) {
        allBooks(genre: $genre) {
            author {
                ...AuthorDetails
            }
            title
            published
            genres
            id
        }
    }
    ${AUTHOR_DETAILS}
`;
export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            title
            author {
                ...AuthorDetails
            }
            published
            genres
            id
        }
    }
    ${AUTHOR_DETAILS}
`;
