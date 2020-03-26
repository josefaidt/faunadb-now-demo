import { HttpLink } from 'apollo-link-http'
import { ApolloServer, makeRemoteExecutableSchema, introspectSchema } from 'apollo-server-micro'
import fetch from 'isomorphic-unfetch'

const link = new HttpLink({
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

  const server = new ApolloServer({ schema, path: '/api' })
  handler = server.createHandler()
  return handler
}

export default async (req, res) => {
  console.log('REQUESTED')
  const handler = await getHandler()
  await handler(req, res)
}