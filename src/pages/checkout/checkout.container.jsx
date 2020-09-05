import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

import CheckoutPage from './checkout.component';

const GET_CART_DATA = gql`
  {
    cartItems @client
    cartTotal @client
  }
`;

const CheckoutPageContainer = () => (
  <Query query={GET_CART_DATA}>
    {({ data: { cartItems, cartTotal } }) => (
      <CheckoutPage total={cartTotal} cartItems={cartItems} />
    )}
  </Query>
);

export default CheckoutPageContainer;
