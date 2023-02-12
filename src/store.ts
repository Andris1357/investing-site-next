import { createStore, Store, Action } from 'redux'; // TD: use redux toolkit

export interface GlobalState {
    current_token_amount: number;
    current_channel_index: number;
}

interface GlobalSetAction extends Action {
    payload: number;
}

const initial_state: GlobalState = {
    current_token_amount: 0,
    current_channel_index: 0,
};

const setGlobalState = (
    state = initial_state, 
    action: GlobalSetAction
): GlobalState => {
    switch (action.type) {
        case "SET_TOKENS":
            return {
                ...state,
                current_token_amount: action.payload
            };
        case "SET_CHANNEL":
            return {
                ...state,
                current_channel_index: action.payload
            }
        default:
           return state;
    }
};

const store: Store<GlobalState, GlobalSetAction> = createStore(setGlobalState);
export default store;