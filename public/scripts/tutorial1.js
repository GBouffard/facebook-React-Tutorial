var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        Hello, world! I am a CommentBox.
      </div>
    );
  }
});
// nb: HTML element names start with a lowercase letter, 
// while custom React class names begin with an uppercase letter.


// The primary API for rendering into the DOM looks like this:
// ReactDOM.render(reactElement, domContainerNode)
ReactDOM.render(
  <CommentBox />,
  document.getElementById('content')
);
