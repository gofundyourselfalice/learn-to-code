import { combineReducers } from 'redux';
import debt from './debt';
import budget from './budget';

export default combineReducers({ debt, budget });