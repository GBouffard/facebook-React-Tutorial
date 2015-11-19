// CLASS CREATION MAIN SYNTAX
// var FooBar = React.createClass({
//   render: function() {
//     return (
//       <div className="fooBar">
//       </div>
//     );
//   }
// });

// this.props (short for "properties") refers to the new class Comment.
// attributes can be passed in JSX syntax with this.props.attributeName 
// and any nested elements as this.props.children

var CommentBox = React.createClass({
  // loadCommentsFromServer is a good symtax example on how to call an API with $.ajax, success and errors
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
      // props are immutable. this.state is private to the component 
      // and can be changed by calling this.setState(). 
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    // Date.now() sets an id on the new comment. Not the best way but 
    // for the purpose of the tutorial it's fine
    comment.id = Date.now();
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});

    // in handleCommentSubmit, we added type: 'POST' because we write in the JSon object
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  // getInitialState() executes exactly once during the lifecycle of the
  // component and sets up the initial state of the component.
  getInitialState: function() {
    return {data: []};
  },
  // componentDidMount is a built-in method called automatically 
  // by React when a component is rendered.
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  // setInterval() calls a function at specified intervals (in milliseconds).
  // The syntax is setInterval(function,milliseconds,param1,param2,...)
  render: function() {
    // React class names begin with an uppercase letter.
    // HTML element (like className="commentBox") with a lowercase.
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  // In a form, onFormNameSubmit= defines what happens when submitted (like onCommentSubmit)
  }
});

var CommentList = React.createClass({
  // {this.props.data} refers to CommentList data.
  // with this.props referring to the top class, in this case CommentList.
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      // in React, when we return <ThisName /> or <ThisName attribute1=value2> child Blabla </ThisName>
      // it means that we are rendering thisName class
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  getInitialState: function() {
    return {author: '', text: ''};
  },
  // we set key/values with this.setState({key: argument.target.value});
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    // preventDefault() is to prevent the browser's default action of submitting the form.
    e.preventDefault();
    var author = this.state.author.trim();
    // the String trim() method Remove whitespace from both sides of a string.
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.setState({author: '', text: ''});
  },
  render: function() {
    // in the form, onSubmit={} defines what happens when Submit is clicked.
    // The onChange prop/callbacks works across browsers and respond to user interactions
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <input
          type="text"
          placeholder="Say something..."
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  // this.state is used to save the user's input as it is entered.
  }
});

var Comment = React.createClass({
  // marked is a library defined as script in index.html
  // {marked(this.props.children.toString())} alone gave "<p>This is <em>another</em> comment</p>".
  // React is protecting us from an XSS (Cross-site scripting) attack, therefore
  // rawMarkup with {sanitize: true} is used in the tutorial but the framework warns us not to use it.
  // by using this feature you're relying on marked to be secure, which is ok for a tutorial.
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  render: function() {
    // in this example the author of each comment is displayed with {this.props.author}
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
  <CommentBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);
