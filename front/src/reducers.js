import { combineReducers } from 'redux';

import account from './reducers/account';
import game from './reducers/game';

export const rootReducer = combineReducers({
    account,
    game
});