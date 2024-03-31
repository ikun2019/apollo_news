// ユーザーが投稿した情報を取得
function links(parent, args, context) {
  return context.prisma.user.findUnique({
    where: { id: parent.id }
  }).links();
};

module.exports = {
  links,
}