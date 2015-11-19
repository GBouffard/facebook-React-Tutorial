// CLASS CREATION MAIN SYNTAX
// var FooBar = React.createClass({
//   render: function() {
//     return (
//       <div className="fooBar">
//       </div>
//     );
//   }
// });

// Below {this.props.data} refers to CommentBox data (see at the bottom)
// with this.props referring to CommentBox

// props are immutable. this.state is private to the component and can be changed 
// by calling this.setState(). getInitialState() executes exactly once during the 
// lifecycle of the component and sets up the initial state of the component.

// componentDidMount is a method called automatically by React 
// when a component is rendered. nb: loadCommentsFromServer is an 
// example method while componentDidMount is a built-in method.

// setInterval() calls a function at specified intervals (in milliseconds).
// The syntax is setInterval(function,milliseconds,param1,param2,...)

// loadCommentsFromServer is a good symtax example on how to call an API with $.ajax, success and errors

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm />
      </div>
    );
  }
});
// nb: React class names begin with an uppercase letter.
// HTML element with a lowercase

// In React & in return <ThisName /> or <ThisName attribute1=value2> child Blabla </ThisName>
// means that we are rendering thisName class

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
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

// In this example each comment has an author and key attributes, and {comment.text} is displayed

var CommentForm = React.createClass({
  render: function() {
    return (
      <div className="commentForm">
        Hello, world! I am a CommentForm.
      </div>
    );
  }
});

// this.props (short for "properties") refers to the new class Comment.
// attributes can be passed in JSX syntax with this.props.attributeName 
// and any nested elements as this.props.children

// marked is a library defined as script in index.html
// with {marked(this.props.children.toString())} we are calling the marked library

// {marked(this.props.children.toString())} alone gave "<p>This is <em>another</em> comment</p>".
// React is protecting us from an XSS (Cross-site scripting) attack, therefore
// rawMarkup with {sanitize: true} is used in the tutorial but the framework warns us not to use it.
// by using this feature you're relying on marked to be secure, which is ok for a tutorial.

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

// in this example the author of each comment is displayed with {this.props.author}

// The primary API for rendering into the DOM looks like this:
// ReactDOM.render(reactElement, domContainerNode)
ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);