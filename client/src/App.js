import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Fib from './Fib';
import OtherPage from './OtherPage';

import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <Link to="/">Home</Link>
            <Link to="/other-page">Other Page</Link>
          </header>
          <div>
            <Route exact path="/" component={Fib} />
            <Route exact path="/other-page" component={OtherPage} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
