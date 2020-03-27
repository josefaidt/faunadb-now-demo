import { createHttpLink } from 'apollo-link-http'
import { ApolloServer, makeRemoteExecutableSchema, introspectSchema } from 'apollo-server-micro'
import fetch from 'isomorphic-unfetch'

const link = createHttpLink({
  uri: 'https://graphql.fauna.com/graphql',
  fetch,
  headers: {
    Authorization: `Bearer ${process.env.DEMO_FAUNA_NOW_TOKEN}`
  }
})

let handler

const getHandler = async () => {
  if (handler) return handler

  const schema = makeRemoteExecutableSchema({
    schema: await introspectSchema(link),
    link
  })
  
  const server = new ApolloServer({ schema, introspection: true })
  handler = server.createHandler({ path: '/api' })
  return handler
}

export default async (req, res) => {
  const handler = await getHandler()
  await handler(req, res)
}