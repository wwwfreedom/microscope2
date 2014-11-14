Template.postItem.helpers({
  ownPost: function() {
    return this.userId === Meteor.userId();
  },

  // need a more comprehensive capture of the domain because the bug at the moment will only display {{domain}} if it was enter as an address starting with http:// might have to modify to use some regular expression to extract the host name for user input that doesn't start with http:// or can even add if http:// if the user in put doesnt have it.
  domain: function () {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  }
});