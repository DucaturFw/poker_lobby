import {
    ACCOUNT_NEW,
    ACCOUNT_INIT,
    ACCOUNT_LOAD,
    ACCOUNT_REG
} from '../constants/account';

const initialState = {
    account: ACCOUNT_INIT
};

export default function accountReducer(state = initialState, action) {
    switch (action.type) {
        case ACCOUNT_NEW:
            return {
                ...ACCOUNT_INIT
            };
        case ACCOUNT_LOAD:
            return {
                ...state,
                loading: true
            };
        case ACCOUNT_REG:
            console.log('reg');
            return {
                ...state,
                new_data: action.account
            }
        default:
            return state;
    }
}