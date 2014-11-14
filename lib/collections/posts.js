Posts = new Mongo.Collection('posts');

Posts.allow({
  update: function(userId, post) { return ownsDocument(userId, post);},
  remove: function(userId, post) { return ownsDocument(userId, post);}
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});

Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url;
  }
})

// global function to validate the the field in post submission
validatePost = function (post) {
  var errors = {};

  if(!post.title){
    errors.title = "Please fill in a headline";
  }

  if (!post.url){
    errors.url = "Please fill in a URL";
  }
  return errors;
}

//meteor method to do a serverside insert
Meteor.methods({
  //using the audit-argument-check package to make sure user input is sanitized
  postInsert: function (postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });

    // using validatePost function to throw an error if the field is left blank when trying to submit.
    var errors = validatePost(postAttributes);
    if (errors.title || errors.url){
      throw new Meteor.error('invalid-post', "You must set a title and URL for your post");
    }

    //code to check if there's no duplicate post (one flow user can still enter the same url without the http/:)
    var postWithSameLink = Posts.findOne({url: postAttributes.url});
    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }

    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      commentsCount: 0
    });

    var postId = Posts.insert(post);
    return {
      _id: postId
    };
  }
});