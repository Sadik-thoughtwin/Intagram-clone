import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import  rootReducer from '../reducer/index'
import thunk from 'redux-thunk'

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;