import React from 'react'

class KeyboardButton extends React.Component {

    render() {
        return (
            <button className={`keyboard-button ${this.props.className}`} onClick={() => this.props.onClick(this.props.value)}>
                {this.props.value}
            </button>

        );
    }
}

export default KeyboardButton;