import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

import CheckoutPage from './checkout.component';

const GET_CART_ITEMS = gql`
  {
    cartItems @client
  }
`;

const GET_CART_TOTAL = gql`
  {
    cartTotal @client
  }
`;

const CheckoutPageContainer = () => (
  <Query query={GET_CART_ITEMS}>
    {({ data: { cartItems } }) => (
      <Query query={GET_CART_TOTAL}>
        {({ data: { cartTotal } }) => (
          <CheckoutPage total={cartTotal} cartItems={cartItems} />
        )}
      </Query>
    )}
  </Query>
);

export default CheckoutPageContainer;
