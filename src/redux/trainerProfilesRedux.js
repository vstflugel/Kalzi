import { PURGE } from "redux-persist"

export const GET_TRAINER = 'GET_TRAINER'
export const GET_LISTENER = 'GET_LISTENER'

const INITIAL_STATE = {listener: []}

export default function userRedux(state = INITIAL_STATE, action) {
    switch (action.type) {
        case GET_TRAINER:
            return { ...state, [action.payload.id]: action.payload.profile }

        case GET_LISTENER:
            return {...state , listener: [...state.listener , action.payload]}

        case PURGE:
            return INITIAL_STATE

        default:
            return state
    }
}