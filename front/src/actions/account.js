import socket from '../listener';

import {
    ACCOUNT_REG,
    ACCOUNT_LOAD
} from '../constants/account';

const AccountActions = {
    register: data => (dispatch, getState) => {
        socket.send({
            type: ACCOUNT_REG,
            payload: data,
        });

        dispatch({
            type: ACCOUNT_LOAD
        });
    },
    setState: data => (dispatch, getState) => {
        dispatch({
            type: ACCOUNT_REG,
            account: data
        });
    }
};
export default AccountActions;