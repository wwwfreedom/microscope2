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

    // update the post with the number of comments
    Posts.update(comment.postId, {$inc: {commentsCount: 1}});

    //create the comment, save the id
    comment._id = Comments.insert(comment);

    // now create a notification, informing the user that there's been a comment
    createCommentNotification(comment);

    // you can insert above and just return the id of the comment
    return comment._id;
  }
});