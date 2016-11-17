import React from 'react'<% if (!!locals.children) { Object.keys(children).forEach(function(childComponent) { %>
<%- children[childComponent].importComponent %><% }) } %>

class <%= componentName %> extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = <%= displayName %>
        this.state = <%- !!locals.initialState ? JSON.stringify(initialState) : JSON.stringify({}) %>
    }

    render() {
        return (
            <div className="<%= componentName %>">
                <%= componentName %><% if (!!locals.children) { Object.keys(children).forEach(function(childComponent) { %>
                <%- children[childComponent].renderComponent %><% }) } %>
            </div>
        )
    }
}

<%= componentName %>.propTypes = {}
<%= componentName %>.defaultProps = <%- !!locals.defaultProps ? JSON.stringify(defaultProps) : JSON.stringify({}) %>

export default <%= componentName %>