Meteor.publish('posts', function () {
  return Posts.find();
});

Meteor.publish('comments', function (postId) {
  //only publish comment for a specific postId
  check(postId, String)
  return Comments.find({postId: postId});
});

Meteor.publish('notifications', function () {
  return Notifications.find();
});