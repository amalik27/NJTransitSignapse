import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import JsonData from './data/data.json';

export class App extends Component {
  state = {
    landingPageData: {},
  }
  getlandingPageData() {
    this.setState({landingPageData : JsonData})
  }

  componentDidMount() {
    this.getlandingPageData();
  }

  render() {
    return (
      <div>
        <Header data={this.state.landingPageData.Header} />
      </div>
    )
  }
}

export default App;
