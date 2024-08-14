import { USER_ACTION_TYPES } from "./user.types";

const createAction = (type, payload) => ({ type, payload });

export const setCurrentUser = (user) => 
    createAction(USER_ACTION_TYPES.SET_CURRENT_USER,user);

export const setCurrentMessages = (messages) => 
    createAction(USER_ACTION_TYPES.SET_CURRENT_MESSAGES,messages);

export const setAddMessage = (messages) => 
    createAction(USER_ACTION_TYPES.SET_ADD_MESSAGE,messages);

export const SET_CURRENT_LOCATION = (location) => 
    createAction(USER_ACTION_TYPES.SET_CURRENT_LOCATION,location);

export const SET_PLAYERS_LOCATION = (locations) => 
    createAction(USER_ACTION_TYPES.SET_PLAYERS_LOCATION,locations);

export const SET_CURRENTPLAYERS = (players) => 
    createAction(USER_ACTION_TYPES.SET_CURRENTPLAYERS,players);

export const SET_CURRENT_PROFILE_IMG = (img) => 
    createAction(USER_ACTION_TYPES.SET_CURRENT_PROFILE_IMG,img);

export const setUpdateMessage = (message) => 
    createAction(USER_ACTION_TYPES.SET_UPDTE_MESSAGE,message);

export const setLoadPost = (load) => 
    createAction(USER_ACTION_TYPES.SET_LOAD_POST,load);

export const addFollow = () => 
    createAction(USER_ACTION_TYPES.ADD_FOLLOW);

export const removeFollow = () => 
    createAction(USER_ACTION_TYPES.REMOVE_FOLLOW);

export const SET_ROUTE = (route) => 
    createAction(USER_ACTION_TYPES.SET_ROUTE,route);