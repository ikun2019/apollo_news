let links = [];

export const resolvers = {
  Query: {
    info: () => 'Hello World!',
    links: () => links
  },
  Mutation: {
    post: (parent, args, context) => {
      const newId = links.length + 1;

      const link = {
        id: `link-${newId}`,
        description: args.input.description,
        url: args.input.url
      };

      links.push(link);
      return link;
    }
  }
}