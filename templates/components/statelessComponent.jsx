import React from 'react'<% if (!!locals.children) { Object.keys(children).forEach(function(childComponent) { %>
<%- children[childComponent].importComponent %><% }) } %>

let <%= componentName %> = (props) => {
    return (
        <div className="<%= componentName %>">
            <%= componentName %><% if (!!locals.children) { Object.keys(children).forEach(function(childComponent) { %>
            <%- children[childComponent].renderComponent %><% }) } %>
        </div>
    )
}

<%= componentName %>.propTypes = {}
<%= componentName %>.defaultProps = <%- !!locals.defaultProps ? JSON.stringify(defaultProps) : JSON.stringify({}) %>

export default <%= componentName %>