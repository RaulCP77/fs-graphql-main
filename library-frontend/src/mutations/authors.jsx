import { gql } from '@apollo/client'

export const EDIT_AUTHOR = gql`
    mutation updateBorn($name: String!, $setBornTo: Int!) {
        editAuthor(name: $name, setBornTo: $setBornTo) {
            name
            born
            bookCount
            id
        }
    }
`;