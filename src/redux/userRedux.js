import { PURGE } from "redux-persist"

export const GET_USER = 'GET_USER'
export const GET_SIGNUP = 'GET_SIGNUP'
export const GET_HOME = 'GET_HOME'
export const GET_SESSION = 'GET_SESSION'

export const GET_NAME = 'GET_NAME'
export const GET_PHOTOURL = 'GET_PHOTOURL'
export const GET_BIRTHDAY = 'GET_BIRTHDAY'
export const GET_HEIGHT = 'GET_HEIGHT'
export const GET_WEIGHT = 'GET_WEIGHT'
export const GET_GENDER = 'GET_GENDER'
export const GET_HEALTH = 'GET_HEALTH'
export const GET_EMAIL = 'GET_EMAIL'
export const GET_PHONE = 'GET_PHONE'
export const GET_SESSIONS = 'GET_SESSIONS'
export const GET_INITIAL_MESSAGES = 'GET_INITIAL_MESSAGES'
export const GET_MORE_MESSAGES = 'GET_MORE_MESSAGES'
export const GET_REALTIME_MESSAGES = 'GET_REALTIME_MESSAGES'
export const GET_REQUESTS = 'GET_REQUESTS'
export const JOINED_SESSION = 'JOINED_SESSION'
export const REMOVE_MESSAGES = 'REMOVE_MESSAGES'
export const GET_NOTIFIED = 'GET_NOTIFIED'
export const REMOVE_SPECIFIC_MESSAGE = 'REMOVE_SPECIFIC_MESSAGE'
export const ADD_IMAGE_LOADING = 'ADD_IMAGE_LOADING'
export const REMOVE_IMAGE_LOADING = 'REMOVE_IMAGE_LOADING'
export const GET_UNREAD = 'GET_UNREAD'

export const HIDE_MESSAGE = 'HIDE_MESSAGE'
export const ADD_BLOCK = 'ADD_BLOCK'

const INITIAL_STATE = {
    signUp: false,
    user: {

        name: '',
        email: '',
        phone: '',
        gender: '',
        height: '',
        weight: '',
        photoUrl: '',
        injury: '',
        sessions: [],
        isTrainer: false,
        birthday: '',
        unread: {},
        transactions: {},
        expiry: {},
        token: ''

    },
    home: {

        slideshow: [],
        trainers: []

    },
    unread: 0,
    sessions: {},
    messages: {},
    imageLoading: {},
    hiddenMessages: {},
    blocked: {}
}

export default function userRedux(state = INITIAL_STATE, action) {
    switch (action.type) {
        case GET_USER:
            return { ...state, user: action.payload }

        case GET_HOME:
            return { ...state, home: action.payload }

        case GET_SIGNUP:
            return { ...state, signUp: action.payload }

        case GET_SESSION:
            return { ...state, sessions: { ...state.sessions, [action.payload.id]: action.payload.session } }

        case GET_UNREAD:
            return {...state , unread: action.payload}

        ///////////////

        case ADD_BLOCK:
            // console.log("BLOCK", action.payload)
            return { ...state, blocked: { ...state.blocked, [action.payload.user]: true } }

        //////////////

        case REMOVE_SPECIFIC_MESSAGE:
            return {
                ...state, messages: {
                    ...state.messages, [action.payload.sessionId]: [state.messages[action.payload.sessionId].map((item, index) => {
                        if (item.id !== action.payload.messageId) {
                            return item
                        }
                    })]
                }
            }

        case HIDE_MESSAGE:
            return {
                ...state, hiddenMessages: {
                    ...state.hiddenMessages, [action.payload.sessionId]: { ...state.hiddenMessages[action.payload.sessionId], [action.payload.messageId]: true }
                }
            }

        case ADD_IMAGE_LOADING:
            return {
                ...state, imageLoading: {
                    ...state.imageLoading, [action.payload.id]: 1
                }
            }

        case REMOVE_IMAGE_LOADING:
            const { [action.payload.id]: removedValue, ...leftOver } = state.imageLoading
            return { ...state, imageLoading: leftOver }

        case REMOVE_MESSAGES:
            return { ...state, messages: {}, imageLoading: {} }

        case GET_INITIAL_MESSAGES:
            return ({
                ...state, messages: {
                    ...state.messages,
                    [action.payload.sessionId]: action.payload.data
                }
            })
        case GET_REALTIME_MESSAGES:
            return ({
                ...state, messages: {
                    ...state.messages,
                    [action.payload.sessionId]: [action.payload.data, ...state.messages[action.payload.sessionId]]
                }
            })
        case GET_MORE_MESSAGES:
            return ({
                ...state, messages: {
                    ...state.messages,
                    [action.payload.sessionId]: [...state.messages[action.payload.sessionId], ...action.payload.data]
                }
            })

        case PURGE:
            return INITIAL_STATE

        default:
            return state
    }
}