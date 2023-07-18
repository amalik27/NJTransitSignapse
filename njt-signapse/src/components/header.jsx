import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Form from './form';
import TextToSpeech from './speech';
import Combined from './combined';
import SignapseAPI from './signapseApi';

export class Header extends Component {
  render() {
    return (
      <Router>
        <div className="header">
          <nav>
            <ul>
              <li>
                <Link to="/form">Form</Link>
              </li>
              <li>
                <Link to="/speech">Speech</Link>
              </li>
              <li>
                <Link to="/">Combined</Link>
              </li>
              <li>
              <Link to="/signapse">Signapse (console)</Link>
              </li>
              <li>
              <Link to="/signapseApi">Signapse API only</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/form" element={<Form />} />
            <Route path="/speech" element={<TextToSpeech />} />
            <Route path="/" element={<Combined />} />
            <Route path="/signapseApi" element={<SignapseAPI />} />
            
          </Routes>
        </div>
      </Router>
    );
  }
}

export default Header;
