const { v1: uuid } = require('uuid')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

// let authors = [
//   {
//     name: "Robert Martin",
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: "Martin Fowler",
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963,
//   },
//   {
//     name: "Fyodor Dostoevsky",
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821,
//   },
//   {
//     name: "Joshua Kerievsky", // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   {
//     name: "Sandi Metz", // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ]

// let books = [
//   {
//     title: "Clean Code",
//     published: 2008,
//     author: "Robert Martin",
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring"],
//   },
//   {
//     title: "Agile software development",
//     published: 2002,
//     author: "Robert Martin",
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ["agile", "patterns", "design"],
//   },
//   {
//     title: "Refactoring, edition 2",
//     published: 2018,
//     author: "Martin Fowler",
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring"],
//   },
//   {
//     title: "Refactoring to patterns",
//     published: 2008,
//     author: "Joshua Kerievsky",
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring", "patterns"],
//   },
//   {
//     title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
//     published: 2012,
//     author: "Sandi Metz",
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring", "design"],
//   },
//   {
//     title: "Crime and punishment",
//     published: 1866,
//     author: "Fyodor Dostoevsky",
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ["classic", "crime"],
//   },
//   {
//     title: "Demons",
//     published: 1872,
//     author: "Fyodor Dostoevsky",
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ["classic", "revolution"],
//   },
// ]


// const resolvers = {
//   Query: {
//     bookCount: async () => await Book.collection.countDocuments(),
//     authorCount: async () => await Author.collection.countDocuments(),
//     allBooks: async (root, args) => {
//       if (!args.author && !args.genre) {
//         return await Book.find({}).populate('author')
//       }

//       if (args.author && !args.genre) {
//         return await Book.find({ author: args.author }).populate('author')
//       }

//       if (!args.author && args.genre) {
//         return await Book.find({ genres: { $in: [args.genre] } }).populate('author')
//       }

//       if (args.author && args.genre) {
//         return await Book.find({ author: args.author, genres: { $in: [args.genre] } }).populate('author')
//       }
//     },
//     allAuthors: async () => await Author.find({}),
//     me: (root, args, context) => {
//       return context.currentUser
//     },
//   },
//   Author: {
//     bookCount: async (root) => {
//       const authorName = root.name
//       const booksByAuthor = await Book.find({ author: authorName })
//       return booksByAuthor.length
//     },
//   },
//   Mutation: {
//     addBook: async (root, args, {currentUser}) => {
//       if (!currentUser) {
//         throw new GraphQLError('Not authenticated', {
//           extensions: {
//             code: 'UNAUTHENTICATED',
//           },
//         })
//       }
//       try {
//         let author = await Author.findOne({ name: args.author.name })

//         if (!author) {
//           author = new Author({ name: args.author.name })
//           await author.save()
//         }

//       const newBook = await Book.create({
//         title: args.title,
//         published: args.published,
//         genres: args.genres,
//         author: author._id
//       });
//       return await newBook.populate('author')
        
//       } catch (error) {
//         if (error.name === 'ValidationError') {
//           throw new GraphQLError(error.message, {
//             extensions: {
//               code: 'BAD_USER_INPUT',
//               invalidArgs: Object.keys(error.errors),
//             },
//           })
//         }
//         throw new GraphQLError('Error adding book', {
//           extensions: {
//             code: 'INTERNAL_SERVER_ERROR'
//           },
//         })
//       }
//     },
//     editAuthor: async (root, args, { currentUser }) => {
//       if (!currentUser) {
//         throw new GraphQLError('Not authenticated', {
//           extensions: {
//             code: 'UNAUTHENTICATED',
//           },
//         })
//       }
//       const authorToEdit = await Author.findOne({ name: args.name })
//       if (!authorToEdit) {
//         throw new GraphQLError(`Author with name ${args.name} not found`)
//       }

//       const updatedAuthor = { ...authorToEdit, born: args.setBornTo }
//       authors = await Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo }, { returnDocument: 'after' })

//       return updatedAuthor
//     },
//     createUser: async (root, args) => {
//       const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
//       const savedUser = await user.save()
//       return savedUser
//     },
//     login: async (root, args) => {
//       const user = await User.findOne({ username: args.username })
//       if (!user || args.password !== 'secret') {
//         throw new GraphQLError('Invalid username or password', {
//           extensions: {
//             code: 'BAD_USER_INPUT',
//           },
//         })
//       }

//       const tokenPayload = { username: user.username, id: user._id }
//       const token = jwt.sign(tokenPayload, process.env.JWT_SECRET)

//       return { value: token }
//     },
//     _resetDatabase: async () => {
//       if (process.env.NODE_ENV !== 'test') {
//         throw new GraphQLError('_resetDatabase is only available in test mode')
//       }
//       await Author.deleteMany({})
//       await Book.deleteMany({})
//       await User.deleteMany({})
//       return true
//     },    
//   },
// }


const resolvers = {
  Query: {
    bookCount: async () => {
      return await Book.countDocuments();
    },

    authorCount: async () => {
      return await Author.countDocuments();
    },

    allBooks: async (root, args) => {
      const filter = {};

      if (args.author) {
        const author = await Author.findOne({
          name: args.author
        });

        if (!author) {
          return [];
        }

        filter.author = author._id;
      }

      if (args.genre) {
        filter.genres = args.genre;
      }

      return await Book.find(filter).populate("author");
    },

    allAuthors: async () => {
      return await Author.find({});
    },

    me: (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED"
          }
        }); 
      }
      return context.currentUser;
    }
  },

  Author: {
    id: (root) => root._id.toString(),

    bookCount: async (root) => {
      return await Book.countDocuments({
        author: root._id
      });
    }
  },

  Book: {
    id: (root) => root._id.toString()
  },

  User: {
    id: (root) => root._id.toString()
  },

  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED"
          }
        });
      }

      try {
        let author = await Author.findOne({
          name: args.author
        });

        if (!author) {
          author = await Author.create({
            name: args.author
          });
        }

        const newBook = await Book.create({
          title: args.title,
          published: args.published,
          genres: args.genres,
          author: author._id
        });

        return await newBook.populate("author");
      } catch (error) {
        console.error(error);

        if (error.name === "ValidationError") {
          throw new GraphQLError(error.message, {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: Object.keys(error.errors)
            }
          });
        }

        throw new GraphQLError("Error adding book", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR"
          }
        });
      }
    },

    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED"
          }
        });
      }

      const updatedAuthor = await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        {
          returnDocument: 'after',
          runValidators: true
        }
      );

      return updatedAuthor;
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      });

      return await user.save();
    },

    login: async (root, args) => {
      const user = await User.findOne({
        username: args.username
      });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("Invalid username or password", {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        });
      }

      const tokenPayload = {
        username: user.username,
        id: user._id.toString()
      };

      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET
      );
      
      return {
        value: token
      };
    },
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== 'test') {
        throw new GraphQLError('_resetDatabase is only available in test mode')
      }
      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})
      return true
    },    
  },
}
module.exports = resolvers