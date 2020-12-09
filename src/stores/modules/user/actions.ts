/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { UserApiResponse } from "finddo-api";
import { UserActionTypes } from "./types";

export function restoreSession() {
  return {
    type: UserActionTypes.restoreSessionRequest,
  };
}

export function signInRequest(email: string, password: string)  {
  return {
    type: UserActionTypes.signInRequest,
    payload: {
      email,
      password,
    }
  };
}

export function signInSuccess(user: UserApiResponse)  {
  return {
    type: UserActionTypes.signInSuccess,
    payload: {
      user,
    }
  };
}

export function signOut()  {
  return {
    type: UserActionTypes.signOut,
  };
}
