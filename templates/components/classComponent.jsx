import React from 'react'

class <%= displayName %> extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = <%= displayName %>
        this.state = <%= initialState %>
    }

    render() {
        return (
            <div className="<%= displayName %>">
                <%= displayName %>
            </div>
        )
    }
}

<%= displayName %>.propTypes = {}
<%= displayName %>.defaultProps = {}

export default <%= displayName %>