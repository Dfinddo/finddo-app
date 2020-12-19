/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { UserActionTypes, UserState } from "./types";

export function signIn(email: string, password: string) {
  return {
    type: UserActionTypes.signIn,
    payload: {
      email,
      password,
    }
  };
}

export function updateUser(user: UserState)  {
  return {
    type: UserActionTypes.updateUser,
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
