import { ApolloServer } from 'apollo-server-micro'
import { HttpLink } from 'apollo-link-http'
import { makeRemoteExecutableSchema, introspectSchema } from 'graphql-tools'
import fetch from 'node-fetch'

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

  const server = new ApolloServer({ schema })
  handler = server.createHandler()
  return handler
}

export default async (req, res) => {
  console.log('REQUESTED')
  const handler = await getHandler()
  await handler(req, res)
}