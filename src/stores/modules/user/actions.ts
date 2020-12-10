/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { UserApiResponse } from "finddo-api";
import { UserActionTypes } from "./types";

export function restoreSession() {
  return {
    type: UserActionTypes.restoreSessionRequest,
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

interface SingUpDataProps {
  name: string,
  surname: string,
  email: string,
  cellphone: string,
  cpf: string,
  birthdate: Date,
}

export function signUpData(newData: SingUpDataProps)  {
  return {
    type: UserActionTypes.signUpData,
    payload: {
      newData,
    }
  };
}

export function updateProfilePhoto(profilePicture: {uri: string})  {
  return {
    type: UserActionTypes.updateProfilePhoto,
    payload: {
      profilePicture,
    }
  };
}

export function signOut()  {
  return {
    type: UserActionTypes.signOut,
  };
}
