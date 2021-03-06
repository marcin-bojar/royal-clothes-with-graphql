import { gql } from 'apollo-boost';
import {
  addItemToCart,
  removeItemFromCart,
  getCartItemsCount,
  getCartTotal,
} from './cart.utils';

export const typeDefs = gql`
  extend type Item {
    quantity: Int
  }

  extend type User {
    id: ID!
    email: String!
    displayName: String!
    createdAt: Int!
  }

  extend type Mutation {
    ToggleCartHidden: Boolean!
    AddItemToCart(item: Item!): [Item]!
    RemoveItemFromCart(item: Item!): [Item]!
    ClearItemFromCart(item: Item!): [Item]!
    SetCurrentUser(user: User!): User!
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

const GET_CURRENT_USER = gql`
  {
    currentUser @client
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

    removeItemFromCart: (_root, { item }, { cache }) => {
      const { cartItems } = cache.readQuery({
        query: GET_CART_DATA,
      });

      const newCartItems = removeItemFromCart(cartItems, item);

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

    clearItemFromCart: (_root, { item }, { cache }) => {
      const { cartItems } = cache.readQuery({
        query: GET_CART_DATA,
      });

      const newCartItems = cartItems.filter(el => el.id !== item.id);

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

    setCurrentUser: (_root, { user }, { cache }) => {
      cache.writeQuery({
        query: GET_CURRENT_USER,
        data: { currentUser: user },
      });
    },
  },
};
