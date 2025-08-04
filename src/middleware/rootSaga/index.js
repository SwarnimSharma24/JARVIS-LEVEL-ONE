import { all } from "redux-saga/effects";
import { loginWatcher } from "../watcherSaga/login";

export default function* rootSaga() {
  yield all([loginWatcher()]);
}
