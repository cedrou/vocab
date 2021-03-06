import React from 'react'
import KeyboardButton from './KeyboardButton'
import './Keyboard.css'


const ShiftIcon = ({viewBox = '0 0 32 32', width = 24, height = 24, fill}) =>
	<svg {...{width, height, fill, viewBox}}>
		<path fill="currentColor" d="M21 28h-10c-0.552 0-1-0.448-1-1v-11h-4c-0.404 0-0.769-0.244-0.924-0.617s-0.069-0.804 0.217-1.090l10-10c0.391-0.39 1.024-0.39 1.414 0l10 10c0.286 0.286 0.372 0.716 0.217 1.090s-0.519 0.617-0.924 0.617h-4v11c0 0.552-0.448 1-1 1zM12 26h8v-11c0-0.552 0.448-1 1-1h2.586l-7.586-7.586-7.586 7.586h2.586c0.552 0 1 0.448 1 1v11z" />
	</svg>
;

const BackspaceIcon = ({viewBox = '0 0 24 24', width = 24, height = 24, fill}) =>
	<svg {...{width, height, fill, viewBox}}>
		<path fill="currentColor" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z" />
	</svg>
;

const Key_Backspace = {id: 'BACKSPACE', value:<BackspaceIcon/>, class:"keyboard-backspace-button"}
const Key_Shift = {id: 'SHIFT', value:<ShiftIcon/>, class:"keyboard-shift-button"}
const Key_Skip = {id: 'SKIP', value:"Passer", class:"keyboard-skip-button"}
const Key_Submit = {id: 'SUBMIT', value:"Envoyer", class:"keyboard-submit-button"}
const Key_Space = {id: " ", value:" ", class:"keyboard-space-button"}

const Layout_Cyrillic = [
    [
        ['ë', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '\\', Key_Backspace],
        ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ'],
        ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э'],
        [Key_Shift, 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', Key_Shift],
        [Key_Skip, Key_Space, Key_Submit]
    ],
    [
        ['Ë', '!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '_', '+', '/', Key_Backspace],
        ['Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ'],
        ['Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э'],
        [Key_Shift, 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', ',', Key_Shift],
        [Key_Skip, Key_Space, Key_Submit]
    ],
];

class Keyboard extends React.Component {

    state = {
        uppercase: false
    }

    handleKeyClick = (key) => {
        if (key === "SHIFT") {
            this.setState({uppercase: !this.state.uppercase});
        }
        else {
            this.props.onClick(key);
            this.setState({uppercase: false});
        }
    }

    renderLayout() {
        let layout = Layout_Cyrillic[this.state.uppercase ? 1 : 0];

        return layout.map ( (row,i) =>
            <div className="keyboard-row" key={`row-${i}`}>

                {row.map( (k,index) => {
                    
                    if (typeof(k) === 'string') {
                        k = {id: k, value: k}
                    }
                    
                    return <KeyboardButton key={k.id + index} id={k.id} value={k.value} className={k.class} onClick={this.handleKeyClick} />
                    
                })}

            </div>
        )
    }

    render() {
        return (
            <div className="keyboard">
                {this.renderLayout()}
            </div>
        );
    }
}

export default Keyboard;