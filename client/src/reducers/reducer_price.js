import { ADD_TICKER_PRICE, LOAD_TICKER_PRICES } from '../actions/types';

export default function(state = {}, action) {
   switch (action.type) {
      case ADD_TICKER_PRICE:
         const { name, type, price } = action.payload;
         const newState = { ...state};
         newState[type][name] = price;
         return newState;
      case LOAD_TICKER_PRICES:
         return action.payload
  }
  return state;
}
