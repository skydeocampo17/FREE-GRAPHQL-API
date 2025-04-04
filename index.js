const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const cors = require("cors");

const app = express();
app.use(cors());

// Sample in-memory data
const movies = [
  { id: "1", title: "Inception", director: "Christopher Nolan", releaseYear: 2010 },
  { id: "2", title: "Interstellar", director: "Christopher Nolan", releaseYear: 2014 }
];

// Define GraphQL schema
const typeDefs = gql`
  type Movie {
    id: ID!
    title: String!
    director: String!
    releaseYear: Int!
  }

  type Query {
    getMovies: [Movie]
    getMovie(id: ID!): Movie
  }

  type Mutation {
    addMovie(title: String!, director: String!, releaseYear: Int!): Movie
  }
`;

// Define resolvers
const resolvers = {
  Query: {
    getMovies: () => movies,
    getMovie: (_, { id }) => movies.find(movie => movie.id === id),
  },
  Mutation: {
    addMovie: (_, { title, director, releaseYear }) => {
      const newMovie = { id: String(movies.length + 1), title, director, releaseYear };
      movies.push(newMovie);
      return newMovie;
    }
  }
};

// Initialize Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Apply middleware and start the server
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server running at http://localhost:4000/graphql");
  });
}

startServer();
