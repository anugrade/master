import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { InMemoryCache, defaultDataIdFromObject  } from 'apollo-cache-inmemory';
import { gql } from "apollo-boost"

let apolloClient;

  const httpLink = new HttpLink({uri: 'http://empade3.service-now.com/api/now/graphql', fetchOptions: {  mode: 'no-cors', }})

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`,
        ),
      );
    }

    if (networkError) console.error(`[Network error]: ${networkError}`);
  });

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });

  const link = ApolloLink.from([
    authLink,
    errorLink,
    httpLink,
  ]);

  apolloClient =  new ApolloClient({
    link,
    cache: new InMemoryCache({
      //why? see https://stackoverflow.com/questions/48840223/apollo-duplicates-first-result-to-every-node-in-array-of-edges/49249163#49249163
      dataIdFromObject: o => (o._id ? `${o.__typename}:${o._id}`: null),
    }),
  });

  apolloClient
  .query({
    query:gql`
    query{
      GlideRecord_Query{
        sys_user {
          _results{
            name {
              value
            }
          }
        }
      }
    }
    `
  })
  .then(result => console.log(result));

ReactDOM.render(<App />, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
