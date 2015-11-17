var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        // <ClassName /> which I never saw before means calling that ClassName
        <CommentList />
        <CommentForm />
      </div>
    );
  }
});
// nb: HTML element names start with a lowercase letter, 
// while custom React class names begin with an uppercase letter.


var CommentList = React.createClass({
  render: function() {
    return (
      <div className="commentList">
        Hello, world! I am a CommentList.
      </div>
    );
  }
});

var CommentForm = React.createClass({
  render: function() {
    return (
      <div className="commentForm">
        Hello, world! I am a CommentForm.
      </div>
    );
  }
});

// The primary API for rendering into the DOM looks like this:
// ReactDOM.render(reactElement, domContainerNode)
ReactDOM.render(
  <CommentBox />,
  document.getElementById('content')
);
