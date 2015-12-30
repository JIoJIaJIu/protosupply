var React = require("react");
var Article = require("./article");

module.exports = React.createClass({
    render: function () {
        var articles = this.props.articles.map(function (article) {
            var d = new Date(article.datetime);
            var dateString = d.getUTCFullYear() + "/" + (d.getUTCMonth() + 1) + "/" + d.getUTCDate();
            return (
                <li>
                    <Article title={article.title} datetime={dateString} content={article.text}>
                    </Article>
                </li>
            )
        });

        return (
            <ul>
                {articles}
            </ul>
        )
    }
});
