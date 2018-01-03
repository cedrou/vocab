// @ts-nocheck
import React, { Component } from 'react';
import ruflag from './assets/Flag_of_Russia.svg';
import frflag from './assets/Flag_of_France.svg';
import './App.css';
import Keyboard from './Keyboard.js'
import vocab from './assets/vocab.json'


class App extends Component {

    MaxTrials = 3;

    shuffle(b) {
        let a = b;
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    state = {
        list: this.shuffle(vocab),
        current: ["",""],
        input: "",
        log: {},

        error: 0,
        success: 0,

        isSuccess: false,
        isError: false,
    };


    handleKeyboardClick = (value) => {
        if (this.state.isError || this.state.isSuccess) return;

        if (value === "SUBMIT") {

            const current = this.state.current[0];

            if (this.state.input === "") return;

            if (this.state.input === this.state.current[1]) {
                let {success, log} = this.state;

                success += 1;
                log[current].trials.push(this.state.input);
                log[current].success = true;
                
                this.setState({success: success, log: log, isSuccess: true, isError: false});
                setTimeout(() => {
                    this.setState({isSuccess: false});
                    this.next();
                }, 2000);
            }
            else {
                let {error, log} = this.state;

                error += 1;
                log[current].trials.push(this.state.input);

                let failed = (log[current].trials.length === this.MaxTrials)

                if (failed) {
                    log[current].trials.push(this.state.current[1]);

                    this.setState({error: error, log: log, isError: true, isSuccess: false, input: this.state.current[1]});

                    setTimeout(() => { 
                        this.setState({isError: false})
                        this.next()
                    }, 2000);
                }
                else {
                    this.setState({error: error, log: log, isError: true, isSuccess: false});
    
                    setTimeout(() => { 
                        this.setState({isError: false})
                    }, 2000);
                }
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
 
        if (state.current) {
            state.log[state.current[0]] = state.log[state.current[0]] || { trials:[], success: false}
        }

        this.setState(state); 
    }

    next () {
        let state = this.state;
        state.current = state.list.shift();
        state.input = "";

        if (state.current) {
            state.log[state.current[0]] = state.log[state.current[0]] || { trials:[], success: false}
        }

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
                                    let className = ((item.success || item.trials.length > this.MaxTrials)  && index === item.trials.length - 1)  ? "bolded" : "striked";
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
                                <div className="App-question">
                                    <div>{this.state.current ? this.state.current[0] : ""}</div>
                                </div>
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
