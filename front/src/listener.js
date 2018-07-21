import io from 'socket.io-client';
import {
    ACCOUNT_INFO_RESULT
} from './constants/account';
import accountActions from './actions/account';

export const socket = io('http://localhost:3100/', { path: '/ws' });

export default ({ dispatch, getState }) => {

    socket.on('getBuyResult', data => {
        accountActions.setState(data)(dispatch, getState);
    })

    socket.on(ACCOUNT_INFO_RESULT, data => {
        accountActions.setState(data)(dispatch, getState);
    });
}