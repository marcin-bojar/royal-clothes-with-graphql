import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-boost';
import { persistCache } from 'apollo-cache-persist';

import { store, persistor } from './redux/store';

import { typeDefs, resolvers } from './graphql/resolvers';

import './index.css';
import { default as App } from './App.container';

const httpLink = createHttpLink({
  uri: 'https://crwn-clothing.com',
});

const cache = new InMemoryCache();

(async () =>
  await persistCache({
    cache,
    storage: window.localStorage,
  }))();

const client = new ApolloClient({
  link: httpLink,
  cache,
  typeDefs,
  resolvers,
});

client.writeData({
  data: {
    cartHidden: true,
    cartItems: [],
    itemsCount: 0,
    cartTotal: 0,
    currentUser: null,
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <BrowserRouter>
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </BrowserRouter>
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
);
