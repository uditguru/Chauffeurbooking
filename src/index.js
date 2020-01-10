import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from "react-apollo";

import ApolloClient from "apollo-boost";
import './index.css';
import App from './App';
import Routes from './router';
import * as serviceWorker from './serviceWorker';

const client = new ApolloClient({
    uri : "//graphqlnew.herokuapp.com/graphql"//"http://localhost:5000/graphql
})

ReactDOM.render(<ApolloProvider client={client} ><Routes/></ApolloProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
