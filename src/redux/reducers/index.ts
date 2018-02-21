import example from './examples';
import  LoginReducer from './login';
import { SocketIOReducer } from "./socketio";
import { combineReducers } from 'redux';
import { routerReducer } from "react-router-redux";

export const WaspApp = combineReducers({
    example,
    login: LoginReducer,
    routing: routerReducer,
    socketIO: SocketIOReducer
});