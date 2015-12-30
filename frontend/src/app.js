var React = require("react");
var ArticleForm = require("./components/articleForm.js");
var ArticleList = require("./components/articleList.js");

var Supply = React.createClass({ 
    componentDidMount: function () {
        this._loadData();
        setInterval(this._loadData.bind(this), 2000);
    },

    getInitialState: function () {
        return {
            articles: []
        }
    },

    onSubmit: function (article) {
        $.post(this.props.url, article);
    },

    render: function () {
        return (
            <div className="container">
                <ArticleList articles={this.state.articles}/>
                <ArticleForm onSubmit={this.onSubmit} url={this.props.url}/>
            </div>
        )
    },

    _loadData: function () {
        var self = this;

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function (data) {
                self.setState({articles: data});
            }
        });
    }
})

ReactDOM.render(
    <Supply url="/articles"/>,
    document.body);
