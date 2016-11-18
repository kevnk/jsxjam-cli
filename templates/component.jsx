import React from 'react'<% if (meta.pureRender) { %>
import PureRenderDecorator from 'pure-render-decorator'<% } if (meta.redux) { %>
import { connect } from 'react-redux'<% } if (!!locals.children) { Object.keys(children).forEach(function(childComponent) { %>
<%- children[childComponent].importComponent %><% }) } %>
<% if (meta.stateless) { %>
let <%= componentName %> = (props) => {
    return (
        <div className="<%= componentName %>">
            <%= componentName %><% if (!!locals.children) { Object.keys(children).forEach(function(childComponent) { %>
            <%- children[childComponent].renderComponent %><% }) } %>
        </div>
    )
}<% } else { %>
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
<% if (meta.pureRender) { %>
<%= componentName %> = PureRenderDecorator(<%= componentName %>) || <%= componentName %>
<% } if (meta.redux) { %>
function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps)(<%= componentName %>)
<% } else { %>
export default <%= componentName %><% } %>