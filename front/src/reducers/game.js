import {
    GAME_NEW,
    GAME_INIT
} from '../constants/game';

const initialState = {
    game: GAME_INIT
};

export default function gameReducer(state = initialState, action) {
    switch (action.type) {
        case GAME_NEW:
            return {
                ...state,
                game: GAME_INIT
            };
        default:
            return state;
    }
}