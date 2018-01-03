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
        log: {},

        error: 0,
        success: 0,

        isSuccess: false,
        isError: false,
    };


    handleKeyboardClick = (value) => {
        if (value === "SUBMIT") {

            if (this.state.input === "") return;

            if (this.state.input === this.state.current[1]) {
                let {success, log} = this.state;

                success += 1;
                log[this.state.current[0]].trials.push(this.state.input);
                log[this.state.current[0]].success = true;
                
                this.setState({success: success, log: log, isSuccess: true, isError: false});
                this.next();
                setTimeout(() => this.setState({isSuccess: false}), 2000);
            }
            else {
                let {error, log} = this.state;

                error += 1;
                log[this.state.current[0]].trials.push(this.state.input);

                this.setState({error: error, log: log, isError: true, isSuccess: false});
                setTimeout(() => this.setState({isError: false}), 2000);
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
 
        state.log[state.current[0]] = state.log[state.current[0]] || { trials:[], success: false}

        this.setState(state); 
    }

    next () {
        let state = this.state;
        state.current = state.list.shift();
        state.input = "";

        state.log[state.current[0]] = state.log[state.current[0]] || { trials:[], success: false}

        this.setState(state); 
    }

    componentDidMount() {
        this.next();
    }

    getAnswerClass() {
        let className = "App-answer";
        if (this.state.isSuccess) className += " answer-success";
        if (this.state.isError) className += " answer-error";
        return className;
    }

    renderLog() {
        return (
            <div className="App-log">
                <table>
                    <thead>
                        <th className="index" >#</th>
                        <th className="word" >Mot</th>
                        <th className="trials" >Essais</th>
                    </thead>
                    {Object.keys(this.state.log).map( (key,i) => {
                        let item = this.state.log[key];

                        return (
                            <tbody className={item.success ? "log-success" : "log-error"}>
                            <tr>
                                <td>{i+1}</td>
                                <td>{key}</td>
                                <td><ul className="horizontal-stack">
                                {item.trials.map ( (trial,index) => {
                                    let className = (item.success && index === item.trials.length - 1) ? "bolded" : "striked";
                                    return <li className={className}>{trial}</li>
                                })}
                                </ul></td>
                            </tr></tbody>
                        );
                    })}
                </table>
            </div>
        )
    }
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Test de vocabulaire franco-russe</h1>
                </header>

                <div className="App-quizz">
                    <table><tbody>
                        <tr>
                            <td>
                            <img src={frflag} className="App-flag" alt="frflag" />
                                <div className="App-question">{this.state.current[0]}</div>
                            </td>
                            <td>
                                <img src={ruflag} className="App-flag" alt="ruflag"/>
                                <div className={this.getAnswerClass()}>{this.state.input}</div>
                            </td>
                        </tr>
                    </tbody></table>
                </div>
 
                <Keyboard onClick={this.handleKeyboardClick} />

                {this.renderLog()}
            </div>
        );
    }
}

export default App;
