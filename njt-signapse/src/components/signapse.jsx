import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Form from './form';
import TextToSpeech from './speech';
import Combined from './combined';
import Signapse from './signapse';

import axios from 'axios';

// Authentication Request
const clientId = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
const encodedCredentials = btoa(`${clientId}:${clientSecret}`);

const authHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Authorization': `Basic ${encodedCredentials}`,
};

const authData = new URLSearchParams();
authData.append('grant_type', 'client_credentials');

axios.post('https://sign-stag.auth.eu-west-2.amazoncognito.com/oauth2/token', authData, { headers: authHeaders })
  .then(authResponse => {
    const accessToken = authResponse.data.access_token;
    console.log(accessToken)

    // Train Announcement Request
    const requestData = {
      timing: '1035',
      destination: 'BAY',
      signLanguageType: 'ASL',
      messageType: 'Departure',
      line: 'NEC',
      platform: '1',
      metaData: {
        messageId: 'messageId here - record of the request id of the client system',
        tenantId: 'tenantId here - client which system',
        userRequestingId: 'userRequestingId here - person who made the request',
        requestTime: 'requestTime here - request time from the client side',
      },
      updatedPlatform: '1',
    };

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    axios.post('https://sign.client.api.stag.signapsesolutions.com/v1/sign-requests/train-announcements', requestData, { headers })
      .then(response => {
        // Handle the response here
        console.log(response.data);
      })
      .catch(error => {
        // Handle the error here
        console.error(error);
      });
  })
  .catch(authError => {
    // Handle the authentication error here
    console.error(authError);
  });

  setInterval(() => {
    //code to check if the data recieved.
  }, 1000);

export class Header extends Component {
  render() {
    return (
<></>
    );
  }
}

export default Header;
