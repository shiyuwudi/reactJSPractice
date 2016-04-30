

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

  componentDidMount(){
    console.log(this.props.data);
  },

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
  render: function() {
    return (
      <div className="commentForm">
        大家好，将来我就是评论提交框！请多关照！！
      </div>
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
      success: data => { this.setState({data: data}) }.bind(this),
      error: (xhr, status, err) =>
      {console.error(this.props.url, status, err.toString())}.bind(this)
    });
  },

  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },

  render: function() {
    return (
      <div className="CommentBox">
        <h1>评论板块</h1>
        <CommentList data={this.state.data}/>
        <CommentForm />
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
