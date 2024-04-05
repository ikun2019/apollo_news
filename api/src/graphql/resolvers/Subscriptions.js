// 受け取る側の設定
async function newLinkSubscribe(parent, args, context) {
  // console.log('subscriptions context =>', context);
  return await context.pubsub.asyncIterator('NEW_LINK');
}

// 受け取る内容
const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => {
    return payload;
  }
}

module.exports = {
  newLink,
};