import React, { Component } from 'react';
import './App.css';
import Layout from './components/Layout/Layout';
import Container from '@material-ui/core/Container';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Container>
          <Layout />
        </Container>
      </div>
    );
  }
}

export default App;
