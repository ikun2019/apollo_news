let links = [
  {
    id: 'link-0',
    description: 'GraphQLチュートリアル',
    url: 'https://google.com'
  }
]

export const resolvers = {
  Query: {
    info: () => 'Hello World!',
    links: () => links
  }
}