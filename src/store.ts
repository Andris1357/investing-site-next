import { createStore, Store, Action } from 'redux'; // TD: use redux toolkit

interface TokenState {
  current_token_amount: number;
}

interface TokenAction extends Action {
    payload: any;
}

const initialState: TokenState = {
  current_token_amount: 0
};

const tokenReducer = (state = initialState, action: TokenAction) => {
    switch (action.type) {
        case 'SET':
            return {
                ...state,
                current_token_amount: action.payload
            };
        default:
           return state;
    }
};

const store: Store<TokenState, TokenAction> = createStore(tokenReducer);
export default store;