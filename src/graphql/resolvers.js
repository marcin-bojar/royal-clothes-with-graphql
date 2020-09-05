import { gql } from 'apollo-boost';
import { addItemToCart, getCartItemsCount, getCartTotal } from './cart.utils';

export const typeDefs = gql`
  extend type Item {
    quantity: Int
  }
  extend type Mutation {
    ToggleCartHidden: Boolean!
    AddItemToCart(item: Item!): [Item]!
  }
`;

const GET_CART_HIDDEN = gql`
  {
    cartHidden @client
  }
`;

const GET_CART_DATA = gql`
  {
    cartItems @client
    cartTotal @client
  }
`;

const GET_ITEMS_COUNT = gql`
  {
    itemsCount @client
  }
`;

export const resolvers = {
  Mutation: {
    toggleCartHidden: (_root, _args, { cache }) => {
      const { cartHidden } = cache.readQuery({
        query: GET_CART_HIDDEN,
      });

      cache.writeQuery({
        query: GET_CART_HIDDEN,
        data: { cartHidden: !cartHidden },
      });

      return !cartHidden;
    },
    addItemToCart: (_root, { item }, { cache }) => {
      const { cartItems } = cache.readQuery({
        query: GET_CART_DATA,
      });

      const newCartItems = addItemToCart(cartItems, item);

      cache.writeQuery({
        query: GET_ITEMS_COUNT,
        data: { itemsCount: getCartItemsCount(newCartItems) },
      });

      cache.writeQuery({
        query: GET_CART_DATA,
        data: {
          cartItems: newCartItems,
          cartTotal: getCartTotal(newCartItems),
        },
      });

      return newCartItems;
    },
  },
};
