import { combineReducers } from "redux";
import testReducer from "./test.reducer";

const reducers = combineReducers({
  tests: testReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
