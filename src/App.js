// @ts-nocheck
import React, { Component } from 'react';
import ruflag from './assets/Flag_of_Russia.svg';
import frflag from './assets/Flag_of_France.svg';
import './App.css';
import Keyboard from './Keyboard.js'
import vocab from './assets/vocab.json'


class App extends Component {

    MaxTrials = 3;

    translateAsync(sourceLang,targetLang,query) {
        return new Promise( (resolve, reject) => {

            let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURI(query)}`;

            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", url, true);
            
            xhttp.onload = function () { 
                if (this.status !== 200) {
                    reject(this.response);
                } 
                else {
                    var response = JSON.parse(xhttp.responseText);
                    resolve (response[0][0][0]);
                }
            }
            xhttp.send();
        });
    }

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
    }

    state = {
        list: [],
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
                    this.nextWord();
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
                        this.nextWord()
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
            this.skipWord();
        }
        else if (value === "BACKSPACE") {
            this.setState({input: this.state.input.substring(0,this.state.input.length-1)});
        }
        else {
            this.setState({input: this.state.input + value});
        }
    }

    skipWord () {
        let state = this.state;
        state.list.push(state.current);
        state.current = state.list.shift();
        state.input = "";
 
        if (state.current) {
            state.log[state.current[0]] = state.log[state.current[0]] || { trials:[], success: false}
        }

        this.setState(state); 
    }
    nextWord (state) {
        
        if (!state) state = this.state;
        state.current = state.list.shift();
        state.input = "";

        if (state.current) {
            state.log[state.current[0]] = state.log[state.current[0]] || { trials:[], success: false}
        }

        this.setState(state); 
    }

    changeLesson(lesson) {
        let list = [].concat(vocab[lesson]);
        this.shuffle(list);

        let state = {
            list: list,

            lesson: lesson,

            current: ["",""],
            input: "",
            log: {},
    
            error: 0,
            success: 0,
    
            isSuccess: false,
            isError: false,
        };
    
        this.nextWord(state);        
    }
    nextLesson () {
        this.changeLesson(Math.min(vocab.length - 1, this.state.lesson + 1));
    }
    prevLesson() {
        this.changeLesson(Math.max(0, this.state.lesson - 1));
    }

    clear () {
        this.changeLesson(vocab.length - 1);
    }

    checkVocabularyAsync(doCheck) {
        let p = Promise.resolve();

        if (doCheck) {
            vocab.forEach( (lesson) => { lesson.forEach( ([fr,ru]) => {
                p = p.then( () => 
                    this.translateAsync("fr","ru",fr).then( toru => { 
                        (ru.toLowerCase() === toru.toLowerCase()) ? Promise.resolve() : this.translateAsync("ru","fr",ru).then( tofr => {
                            if (fr.toLowerCase() !== tofr.toLowerCase()) {
                                console.log(`${fr} - ${ru} - ${toru} - ${tofr}`);
                            }
                            return Promise.resolve(); 
                        });
                    })
                );
            }) });
        }

        return p;
    }
    componentDidMount() {
        this.checkVocabularyAsync(false).then( () => this.clear());
    }

    getAnswerClass() {
        let className = "App-answer";
        if (this.state.isSuccess) className += " answer-success";
        if (this.state.isError) className += " answer-error";
        return className;
    }

    render() {
        return (
            <div className="App">
 
                <div className="Lesson-selector">
                    <h1>
                        <button className="nav" onClick={(e) => this.prevLesson()} disabled={this.state.lesson === 0}>&#8249;</button>
                        Leçon {this.state.lesson + 1} / {vocab.length}
                        <button className="nav" onClick={(e) => this.nextLesson()} disabled={this.state.lesson === vocab.length - 1}>&#8250;</button>
                    </h1>
                    <h3>{this.state.list.length} mots</h3>
                </div>

                <div className="App-quizz">
                    <table><tbody>
                        <tr>
                            <td>
                                <img src={frflag} className="App-flag" alt="frflag" />
                                <div className="App-question">
                                    <span>{this.state.current ? this.state.current[0] : ""}</span>
                                </div>
                            </td>
                            <td>
                                <img src={ruflag} className="App-flag" alt="ruflag"/>
                                <div className={this.getAnswerClass()}><span>{this.state.input}</span></div>
                            </td>
                        </tr>
                    </tbody></table>
                </div>
 
                <Keyboard onClick={this.handleKeyboardClick} />

                <div className="App-log">
                    <table>
                        <thead><tr>
                            <th className="index" >#</th>
                            <th className="word" >Mot</th>
                            <th className="trials" >Essais</th>
                        </tr></thead>

                        {Object.keys(this.state.log).map( (key,rowindex) => {
                            let item = this.state.log[key];

                            return (
                                <tbody key={`log-row-${rowindex}`} className={item.success ? "log-success" : item.trials.length > this.MaxTrials ? "log-error" : "log-uncompleted"}><tr>
                                    <td>{rowindex+1}</td>
                                    <td>{key}</td>
                                    <td><ul className="horizontal-stack">
                                    {item.trials.map ( (trial,trialindex) => {
                                        let className = ((item.success || item.trials.length > this.MaxTrials)  && trialindex === item.trials.length - 1)  ? "bolded" : "striked";
                                        return <li key={`log-trial-${trialindex}`} className={className}>{trial}</li>
                                    })}
                                    </ul></td>
                                </tr></tbody>
                            );
                        })}
                    </table>
                </div>
            </div>
        );
    }
}

export default App;
