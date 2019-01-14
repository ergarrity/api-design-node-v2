import { makeExecutableSchema } from 'graphql-tools' //library that lets us combine queries and have them know about each other
//GraphQL can't do anything with a plain string; has to convert it to that object type we talked about

import { userType, userResolvers } from './resources/user'
//userType is just a string of graphQL file

import merge from 'lodash.merge'

import { graphqlExpress } from 'apollo-server-express'
//middleware we use to mount graphQL server on an express route. we will use this to 
//attach our graphQL implementation

// root definitions fop GraphQL
// minimum, has to have a query for baseSchema (doesn't necessarily have to have a mutation)
// if graphQL is a tree, this is the root
const baseSchema = `
  schema {
    query: Query
  }
`

const schema = makeExecutableSchema({
  // all the graphql files
  // array of our type definitons (just strings of the graphQL files we wrote)
  typeDefs: [
    baseSchema,
    userType
  ],
  // all the resolvers
  // object of all resolvers put together
  // they're just objects with methods on them (methods correlate to mutations and queries)
  resolvers: merge(
    {},
    userResolvers
  )
})

// takes callback, callback exposes request object (has headers, path, everything associated
// with incoming request)
// returns object with executable schema
export const graphQLRouter = graphqlExpress((req) => ({
  schema,
  context: {
    req,
    user: req.user
  }
}))
