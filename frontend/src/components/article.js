var React = require("react");

module.exports = React.createClass({
    render: function () {
        return  (
            <div>
                <h2>{this.props.title}</h2>
                <span>{this.props.datetime}</span>
                <p>{this.props.content}</p>
            </div>
        )
    }
})
