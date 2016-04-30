

var Comment = React.createClass({

  rawMarkup: function() {
    {/*children就是子节点*/}
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()}></span>
      </div>
    );
  }
});

var CommentList = React.createClass({

  render: function() {

    var commentNodes = this.props.data.map(
      comment =>
      <Comment author={comment.author} key={comment.id}>
        {comment.text}
      </Comment>
    );

    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );

  }
});

var CommentForm = React.createClass({

  getInitialState: function() {
    return { author: '', text: ''};
  },

  handleNameChanged: function(e) {
    this.setState({ author: e.target.value});
  },

  handleCommentChanged: function(e) {
    this.setState({ text: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var comment = this.state.text.trim();
    if (!author || !comment) {
      alert('没填全');
      return;
    }
    this.props.onCommentSubmit({
      author:this.state.author,
      text: this.state.text
    });
    this.setState({author:'', text: ''});
  },

  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>

        <input
          type="text"
          placeholder="你的姓名"
          value={this.state.author}
          onChange={this.handleNameChanged}
          />
        <input
          type="text"
          placeholder="说点什么吧..."
          value={this.state.text}
          onChange={this.handleCommentChanged}
          />
        <input type="submit" value="提交评论"></input>
      </form>
    );
  }
});

var CommentBox = React.createClass({

  getInitialState: function() {
    return {data : []};
  },

  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data){
        this.setState({data: data});
      }.bind(this),
      error: (xhr, status, err) =>
      {console.error(this.props.url, status, err.toString())}
    });
  },

  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },

  handleCommentSubmit: function(comment){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: data => { this.setState({data: data})},
      error: (xhr, status, err) =>
      {console.error(this.props.url, status, err.toString())}
    });
  },

  render: function() {
    return (
      <div className="CommentBox">
        <h1>评论板块</h1>
        <CommentList data={this.state.data}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
      </div>
    );
  }
});

//假数据
var data = [
  {id:'1', author:'shiyu', text:'i love u wanning~'},
  {id:'2', author:'jinwanning', text:'me *too*~, darling'}
];

ReactDOM.render(
  <CommentBox url="http://localhost:3000/api/comments" pollInterval={5000}/>,
  document.getElementById('content')
);
