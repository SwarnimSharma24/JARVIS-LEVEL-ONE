import {takeLatest} from "redux-saga/effects";

// import { fetchLoginRequest } from "../../../features/slices/userSlice";
import { fetchLoginRequest } from "../../../features/login/userSlice";
import { fetchLogin } from "../../workerSaga/login";

export function* loginWatcher() {
    yield takeLatest(fetchLoginRequest.type, fetchLogin);
}