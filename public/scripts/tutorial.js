var App = React.createClass({
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
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    comment.id = Date.now();
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});

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
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div
        className="app">
        <h1 
          className="app__comments-header">
          Comments
        </h1>
        <MessagesCounter myCounter={this.state.data.length}/>
        <MostRecentPoster data={this.state.data}/>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

// Added a Counter as a new task.
var MessagesCounter = React.createClass({ 


  render: function() {
    return (
      <div 
        className="messages-counter">
        Number of Messages: {this.props.myCounter}
      </div>
    ); 
  }
});

// Added a method that returns the most frequent poster
var MostRecentPoster = React.createClass({

  returnTheMostFrequentPoster: function() {
    var authorsList = [];
    // we make an array with all the authors
    for (var i = 0; i < this.props.data.length; i++) {
      authorsList.push(this.props.data[i].author);
    }
    // we make a hash with all the authors as key and their ocurrences as values.
    var authorsOccurences = {};
    for (var j = 0; j < authorsList.length; j++) {
      authorsOccurences[authorsList[j]] = (authorsOccurences[authorsList[j]] || 0) + 1;
    }
    // we find the maximum number of posts made
    var maximum = 0;
    for (var key in authorsOccurences) {
      if (authorsOccurences[key] > maximum) { maximum = authorsOccurences[key] }
    }
    // we store the poster(s) who have made that maximum of posts in an array that we return
    var mostFrequentPosters = []
    for (var key in authorsOccurences) {
      if (authorsOccurences[key] == maximum) { mostFrequentPosters.push(key) }
    }
    return mostFrequentPosters.toString();
  },

  render: function() {
    var mfp = this.returnTheMostFrequentPoster();
    return (
      <div 
        className="most-recent-poster">
        Most Frequent Poster(s): {mfp}
      </div>
    ); 
  }
});

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
      <div 
        className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  getInitialState: function() {
    return {author: '', text: ''};
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.setState({author: '', text: ''});
  },
  render: function() {
    return (
      <form
        className="commentForm"
        onSubmit={this.handleSubmit}>

        <input
          type="text"
          placeholder="Your name"
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />

        <input
          type="text"
          placeholder="Your comment..."
          value={this.state.text}
          onChange={this.handleTextChange}
        />

        <input 
          type="submit" 
          value="Enter Comment" 
          className="newCommentButton"
        />
      </form>
    );
  }
});

var Comment = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      <div 
        className="commentList__comment">

        <div
          className="commentList__comment-author">
          {this.props.author}
        </div>

        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});


ReactDOM.render(
  <App url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);
