import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
    state = {
        seenIndexes: [],
        values: {},
        index: ''
    }

    componentDidMount() {
        this.fetchValues();
        this.fetchIndexes();
    }

    async fetchValues() {
        const values = await axios.get('/api/values/current');
        this.setState({ values: values.data });
    }

    async fetchIndexes() {
        const seenIndexes = await axios.get('/api/values/all');
        this.setState({
            seenIndexes: seenIndexes.data
        });
    }

    renderSeenIndexes() {
        return this.state.seenIndexes.map(({ number }) => number).join(',');
    }

    renderValues() {
        const entries = [];

        for (let key in this.state.values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {this.state.valeus[key]}
                </div>
            )
        }

        return entries;
    }

    async handleSubmit(event) {
        event.preventDefault();

        await axios.post('/api/values', {
            index: this.state.index
        });
        
        this.setState({ index: '' });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter your index:</label>
                    <input 
                        value={this.state.index}
                        onChange={e => this.setState({ index: e.target.value })}
                    />
                    <button>Submit</button>
                </form>
                
                <h3>Index I have seen: </h3>
                {this.renderSeenIndexes()}

                <h3>Calculated Values: </h3>
                {this.renderValues()}
            </div>
        )
    }
}

export default Fib;
