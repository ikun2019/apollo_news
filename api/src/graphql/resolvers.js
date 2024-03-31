export const resolvers = {
  Query: {
    info: () => 'Hello World!',
    links: async (parent, args, context) => {
      return context.prisma.link.findMany();
    }
  },
  Mutation: {
    post: async (parent, args, context) => {
      const newLink = await context.prisma.link.create({
        data: {
          description: args.input.description,
          url: args.input.url
        }
      });
      return newLink;
    },
    signup: async (parent, args, context) => {

    },
  }
}