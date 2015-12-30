var React = require("react");

module.exports = React.createClass({
    getInitialState: function () {
        return {
            title: null,
            text: null
        }
    },

    onTitleChange: function (e) {
        this.setState({title: e.target.value});
    },

    onTextChange: function (e) {
        this.setState({text: e.target.value});
    },

    onSubmit: function (e) {
        e.preventDefault();
        var text = this.state.text;
        var title = this.state.title;
        if (!text || !title)
            return;

        this.setState({title: ''});
        this.setState({text: ''});
        this.props.onSubmit({title: title, text: text});
    },

    render: function () {
        return (
            <form action="POST" action={this.props.url} onSubmit={this.onSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input id="title" className="form-control" value={this.state.title} onChange={this.onTitleChange}/>
                </div>

                <div className="form-group">
                    <label htmlFor="text">Text</label>
                    <textarea id="text" className="form-control" value={this.state.text} onChange={this.onTextChange}></textarea>
                </div>

                <button type="submit" className="btn btn-default">Submit</button>
            </form>
        )
    }
});
