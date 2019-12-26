import { createStore, combineReducers } from 'redux'
import {HighScore} from './Actions';

interface ActionHighScore{
   payload: {score: number},
   type: string
}

let INITIAL_STATE_LOGIN = {
   score: localStorage.getItem('score') ? parseInt(localStorage.getItem('score')!) : 0,
} as HighScore

let highscoreReducer = (state = INITIAL_STATE_LOGIN, action: ActionHighScore) => {
  switch (action.type) {
    case 'SET_HIGHSCORE':
      localStorage.setItem('score', action.payload.toString());
      return { score: action.payload};   //Throws error since userid is stored as an integer
    default:
      return state;
  }
}


export const store = createStore(combineReducers({highscore: highscoreReducer} as any));

//store.dispatch(setLogin({username: 'test', password: '1', firstname: 'ali', lastname: 'veli', email: 'a@a.com'}))
