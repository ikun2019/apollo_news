const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../../utils');

// * sugnup mutation
async function signup(parent, args, context) {
  const hashedPassword = await bcrypt.hash(args.input.password, 10);
  const user = await context.prisma.user.create({
    data: {
      ...args.input,
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
  console.log('post mutation context =>', context);
  const { userId } = context;
  const newLink = await context.prisma.link.create({
    data: {
      url: args.input.url,
      description: args.input.description,
      postedBy: { connect: { id: userId } },
    }
  });
  // subscribeに送信する
  context.pubsub.publish('NEW_LINK', newLink);
  return newLink;
};

// * vote mutation
async function vote(parent, args, context) {
  console.log('Vote Mutation');
  const userId = context.userId;
  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId,
      }
    }
  });
  console.log(vote);
  if (Boolean(vote)) {
    throw new Error(`すでに投稿には投票されています:${args.linkId}`);
  };
  const newVote = await context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } },
    },
  });
  context.pubsub.publish('NEW_VOTE', newVote);
  return newVote;
}

module.exports = {
  signup,
  login,
  post,
  vote,
};