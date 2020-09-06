import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { gql } from 'apollo-boost';

import CartIcon from './cart-icon.component';

const TOGGLE_CART_HIDDEN = gql`
  mutation ToggleCartHidden {
    toggleCartHidden @client
  }
`;

const GET_ITEMS_COUNT = gql`
  {
    itemsCount @client
  }
`;

const CartIconContainer = () => (
  <Mutation mutation={TOGGLE_CART_HIDDEN}>
    {toggleCartHidden => (
      <Query query={GET_ITEMS_COUNT}>
        {({ data: { itemsCount } }) => (
          <CartIcon
            toggleCartHidden={toggleCartHidden}
            itemCount={itemsCount}
          />
        )}
      </Query>
    )}
  </Mutation>
);

export default CartIconContainer;
