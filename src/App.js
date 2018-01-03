// @ts-nocheck
import React, { Component } from 'react';
import ruflag from './assets/Flag_of_Russia.svg';
import frflag from './assets/Flag_of_France.svg';
import './App.css';
import Keyboard from './Keyboard.js'
import vocab from './assets/vocab.json'


class App extends Component {

    kbd = null;

    state = {
        list: vocab,
        current: ["",""],
        input: "",
        log: [],

        error: 0,
        success: 0
    };


    handleKeyboardClick = (value) => {
        if (value === "SUBMIT") {

            if (this.state.input === "") return;

            if (this.state.input === this.state.current[1]) {
                let {success, log} = this.state;

                success += 1;
                log.push(`[Correct] ${this.state.current[0]} -> ${this.state.input}`);
                this.setState({success: success, log: log});
                this.next();
            }
            else {
                let {error, log} = this.state;
                error += 1;
                log.push(`[Erreur ] ${this.state.current[0]} -> ${this.state.input}`);
                this.setState({error: error, log: log});
            }
        }
        else if (value === "SKIP") {
            this.skip();
        }
        else if (value === "BACKSPACE") {
            this.setState({input: this.state.input.substring(0,this.state.input.length-1)});
        }
        else {
            this.setState({input: this.state.input + value});
        }
    }

    skip () {
        let state = this.state;
        state.list.push(state.current);
        state.current = state.list.shift();
        state.input = "";
        this.setState(state); 
    }
    next () {
        let state = this.state;
        state.current = state.list.shift();
        state.input = "";
        this.setState(state); 
    }

    componentDidMount() {
        this.next();
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Test de vocabulaire</h1>
                </header>

                <div className="App-quizz">
                    <table ><tbody>
                        <tr>
                            <td>
                            <img src={frflag} className="App-flag" alt="frflag" />
                                <div className="App-question">{this.state.current[0]}</div>
                            </td>
                            <td>
                                <img src={ruflag} className="App-flag" alt="ruflag"/>
                                <div className="App-answer">{this.state.input} </div>
                            </td>
                        </tr>
                    </tbody></table>
                </div>
 
                <Keyboard onClick={this.handleKeyboardClick} />

            </div>
        );
    }
}

export default App;
