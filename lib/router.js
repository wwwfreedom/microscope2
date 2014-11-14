Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function  () {
    return [Meteor.subscribe('posts'), Meteor.subscribe('notifications')]
  }
});

Router.onBeforeAction('dataNotFound', {only: 'postPage'});

Router.route('/', {name: 'postsList'});
Router.route('/posts/:_id', {
  name: 'postPage',
  //only load the comment data when for that specific post according to the id
  waitOn: function () {
    return Meteor.subscribe('comments', this.params._id);
  },
  data: function () { return Posts.findOne(this.params._id);}
});

Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  data: function() { return Posts.findOne(this.params._id);}
})

Router.route('/submit', {name: 'postSubmit'});

var requireLogin = function() {
  if (! Meteor.user()){
    if (Meteor.loggingIn()){
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});