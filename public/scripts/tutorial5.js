var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList />
        <CommentForm />
      </div>
    );
  }
});
// nb: HTML element names start with a lowercase letter, 
// while custom React class names begin with an uppercase letter.

// Also <ClassName /> which I never saw before means calling that ClassName

// ...and when with attributes, it's:
// <ClassName attributeKey='Blabla'> Blabla2 </ClassName>

var CommentList = React.createClass({
  render: function() {
    return (
      <div className="commentList">
        <Comment author="Guillaume">This is one comment</Comment>
        <Comment author="Guillaume Evil Twin">This is *another* comment</Comment>
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

// this.props refers to the new class Comment.
// attributes can be accessed with this.props.key and any nested elements as this.props.children
// this will allow to re-use the same code for each unique comment.

// marked is a library defined as script in index.html
// with {marked(this.props.children.toString())} we are calling the marked library

// React is protecting us from an XSS (Cross-site scripting) attack, therefore
// rawMarkup with {sanitize: true} is to avoid  "<p>This is <em>another</em> comment</p>"
// It's being used in the tutorial but the framework warns us not to use it.

var Comment = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
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
