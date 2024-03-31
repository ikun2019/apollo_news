const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../../utils');

// * sugnup mutation
async function signup(parent, args, context) {
  const hashedPassword = await bcrypt.hash(args.input.password, 10);
  const user = await context.prisma.user.create({
    data: {
      ...args,
      password: hashedPassword,
    }
  });

  const token = jwt.sign({ userId: user.userId }, JWT_SECRET);
  return {
    token,
    user,
  };
};

// * login mutation
async function login(parent, args, context) {
  const user = await context.prisma.user.findUnique({ where: { email: args.input.email } });
  if (!user) {
    throw new Error('ユーザーが見つかりません');
  };
  const password = args.input.password;
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('ユーザーとパスワードが一致しません');
  };
  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  return {
    token,
    user,
  };
}

// * post mutation
async function post(parent, args, context) {
  const { userId } = context;
  const newLink = await context.prisma.link.create({
    data: {
      url: args.input.url,
      description: args.input.description,
      postedBy: { connect: { id: userId } },
    }
  });
  return newLink;
};

module.exports = {
  signup,
  login,
  post,
};