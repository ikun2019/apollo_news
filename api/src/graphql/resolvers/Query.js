function links(parent, args, context) {
  return context.prisma.link.findMany();
};

module.exports = {
  links,
};