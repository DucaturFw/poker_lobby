import messaging from '../message';

import {
    GAME_REG,
    GAME_LOAD,
    GAME_STATE_SET
} from '../constants/game';

const GameActions = {
    register: data => (dispatch, getState) => {
        messaging.send({
            type: GAME_REG,
            payload: data,
        });

        dispatch({
            type: GAME_LOAD
        });
    },
    setGame: game => (dispatch, getState) => {
        dispatch({
            type: GAME_STATE_SET,
            payload: game
        })
    }
};
export default GameActions;