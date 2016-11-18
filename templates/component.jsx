import React from 'react'<% if (!!locals.children) { Object.keys(children).forEach(function(childComponent) { %>
<%- children[childComponent].importComponent %><% }) } %>
<% if (meta.stateless) { %>
let <%= componentName %> = (props) => {
    return (
        <div className="<%= componentName %>">
            <%= componentName %><% if (!!locals.children) { Object.keys(children).forEach(function(childComponent) { %>
            <%- children[childComponent].renderComponent %><% }) } %>
        </div>
    )
} <% } else { %>
class <%= componentName %> extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = <%= component.displayName %>
        this.state = <%- JSON.stringify(component.state) %>
    }

    render() {
        return (
            <div className="<%= componentName %>">
                <%= componentName %><% if (!!locals.children) { Object.keys(children).forEach(function(childComponent) { %>
                <%- children[childComponent].renderComponent %><% }) } %>
            </div>
        )
    }
}<% } %>

<%= componentName %>.propTypes = <%- JSON.stringify(component.propTypes) %>
<%= componentName %>.defaultProps = <%- JSON.stringify(component.defaultProps) %>

export default <%= componentName %>