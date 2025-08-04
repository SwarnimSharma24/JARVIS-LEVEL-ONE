import { call, put } from "redux-saga/effects";
import { fetchLoginSuccess, fetchLoginFailure } from "../../features/login/userSlice";
import { LoginCall } from "../../services/login/login";

/** fetch all login saga workers */
export function* fetchLogin(data) {
    try{
        const response = yield call(LoginCall, data);
        console.log(response, "loginRequestSuccess>>>>>")
        yield put(fetchLoginSuccess(response));
    } catch (error) {
        console.error(error, "error in gettingfetchLoginDetails>>>>>");
        yield put(fetchLoginFailure(error.message));
    }
}