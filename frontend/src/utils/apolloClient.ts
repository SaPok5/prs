import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Store } from '@reduxjs/toolkit';
import { selectCurrentToken } from '@/redux/auth/authSlice';
import { ServerURL } from '@/constants/ApiUrl';

const createApolloClient = (store: Store) => {
  const httpLink = createHttpLink({
    uri: `${ServerURL}/graphql`,
  });

  const authLink = setContext((_, { headers }) => {
    // Get the current state from the Redux store
    const state = store.getState();
    // Use the selector to get the token from the state
    const token = selectCurrentToken(state);

    return {              
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;