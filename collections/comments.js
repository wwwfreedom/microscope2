Comments = new Mongo.Collection('comments');

Meteor.methods({
  commentInsert: function (commentAttributes) {
    //can also use the Meteor.userId() like in post.js postInsert method, to return the id of the current logged in user which is also the the data context of 'this'
    check(this.userId, String);
    check(commentAttributes, {
      postId: String,
      body: String
    });

    var commentPost = Posts.findOne(commentAttributes.postId);
    if(!commentPost) {
      throw new Meteor.error('invalid-comment', "You must comment on a post")
    }

    var user = Meteor.user();
    var comment = _.extend(commentAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    return Comments.insert(comment);
  }
});