const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const typeDefs = require("./schema")
const resolvers = require("./resolvers")
const jwt = require("jsonwebtoken")
const User = require("./models/user")


const getUserFromAuthHeader = async (auth) => {

  if (!auth || !auth.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = auth.substring(7);

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken.id);

    return user;
  } catch (error) {
    return null;
  }
};

const startServer = async (port) => {
    const server = new ApolloServer({
    typeDefs,
    resolvers,
    })
    startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        const currentUser = await getUserFromAuthHeader(auth)
        return { currentUser }
    },
    }).then(({ url }) => {
    console.log(`Server ready at ${url}`)
    })
}

module.exports = startServer