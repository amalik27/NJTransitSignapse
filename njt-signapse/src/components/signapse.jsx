import axios from 'axios';


const clientId = '42eehk3f7pn1jg0m5rjavn721u';
const clientSecret = '12afnjpr092fo47b3dtkbcjsnhir5nvpal7m8pq3q39ttq30j7s7';
const encodedCredentials = btoa(`${clientId}:${clientSecret}`);

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Authorization': `Basic ${encodedCredentials}`,
};

const data = new URLSearchParams();
data.append('grant_type', 'client_credentials');

axios.post(' https://sign-stag.auth.eu-west-2.amazoncognito.com/oauth2/token', data, { headers })
  .then(response => {
    // Handle the response here
    console.log(response.data);
  })
  .catch(error => {
    // Handle the error here
    console.error(error);
  });
