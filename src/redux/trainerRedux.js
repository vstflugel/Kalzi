import { PURGE } from "redux-persist"

export const GET_PARTICIPANTS = 'GET_PARTICIPANTS'

const INITIAL_STATE = {}

export default function userRedux(state = INITIAL_STATE, action) {
    switch (action.type) {
        case GET_PARTICIPANTS:
            return { ...state, [action.payload.id]: action.payload.participants }

        case PURGE:
            return INITIAL_STATE

        default:
            return state
    }
}