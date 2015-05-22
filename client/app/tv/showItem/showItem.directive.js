'use strict';

angular.module('critiqueApp')
  .directive('showItem', ['comment', 'Auth', function (Comment, Auth) {
    return {
      templateUrl: 'app/tv/showItem/showItem.html',
      restrict: 'E',
      link: function (scope, element) {

        var resetComments = function() {
          // Load the comments initially from the database
          scope.comments = Comment.query({ by: 'show', id: scope.show._id });

          // Toggles the visibility of the input box & button
          scope.showCommentbox = false;
        };

        resetComments();

        scope.toggleInput = function() {
          scope.showCommentbox = !scope.showCommentbox;
        };

        // TODO: Should this logic be moved to controller (hint: yes) //

        /* Save a new comment to the db */
        scope.sendComment = function() {

          var commentText = element.find('input').val();
          var showId = scope.show._id;
          var userId = Auth.getCurrentUser()._id;

          var newComment = new Comment({ showId: showId, comment: commentText, userId: userId });
          newComment.$save(resetComments);

          element.find('input').val('');
        };

        /* Remove existing comment from db */
        scope.removeComment = function(comment) {

          var commentId = comment._id;

          var removableComment = Comment.get({ id: commentId }, function() {
            removableComment.$delete({ id: commentId }, resetComments);
          });
        };

      }
    };
  }]);