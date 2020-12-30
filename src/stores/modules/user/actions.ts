import { UserActions, UserActionTypes, UserState } from "./types";

export function signIn(email: string, password: string): UserActions {
  return {
    type: UserActionTypes.signIn,
    payload: {
      email,
      password,
    }
  };
}

export function updateUser(user: UserState): UserActions {
  return {
    type: UserActionTypes.updateUser,
    payload: {
      user,
    }
  };
}

export function updateProfilePhoto(profilePicture: {uri: string}): UserActions {
  return {
    type: UserActionTypes.updateProfilePhoto,
    payload: {
      profilePicture,
    }
  };
}

export function signOut(): UserActions  {
  return {
    type: UserActionTypes.signOut,
  };
}
