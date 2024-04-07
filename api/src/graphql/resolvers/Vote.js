function link(parent, args, context) {
  return context.prisma.link.findUnique({
    where: { id: parent.id }
  });
};

function user(parent, args, context) {
  return context.prisma.link.findUnique({
    where: { id: parent.id }
  });
};

module.exports = {
  link,
  user,
};