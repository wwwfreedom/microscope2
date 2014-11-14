Template.commentSubmit.created = function () {
  Session.set('commentSubmitErrors', {});
}

Template.commentSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('commentSubmitErrors')[field];
  },
  errorClass: function(field) {
    return !!Session.get('commentSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.commentSubmit.events({
  'submit form': function (e, template) {
    e.preventDefault();

    //name=body is refering to the textarea with name="body" in comment_submit.html using jquery to find and select the textarea
    var $body = $(e.target).find('[name=body]');
    var comment = {
      body: $body.val(),
      //need to find out what is template.data._id is refering to
      postId: template.data._id
    };

    var errors = {};
    if (! comment.body) {
      errors.body = "Please write some content";
      return Session.set('commentSubmitErrors', errors);
    }

    Meteor.call('commentInsert', comment, function (error, commentId) {
      if(error) {
        throwError(error.reason);
      } else {
        $body.val('');
      }
    });
  }
});