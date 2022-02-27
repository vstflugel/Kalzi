import {createStore,combineReducers,applyMiddleware} from 'redux'
import {persistStore,persistReducer} from 'redux-persist'
import thunk from 'redux-thunk'
import AsyncStorage from '@react-native-async-storage/async-storage'
import userRedux from './userRedux'
import trainerProfilesRedux from './trainerProfilesRedux'
import trainerRedux from './trainerRedux'

const rootReducer = combineReducers ({
    user: userRedux,
    trainerProfiles: trainerProfilesRedux,
    trainer: trainerRedux
})

const persistConfig = {
    key:'root',
    storage: AsyncStorage,
    whitelist: ['user']
}

const pReducer = persistReducer(persistConfig, rootReducer)

export const store =  createStore(pReducer,applyMiddleware(thunk))
export const persistor = persistStore(store)