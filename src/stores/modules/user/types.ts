import { Address } from "../adresses/types";

export enum UserActionTypes {
  updateUser= "UPDATE_USER",
  signIn= "SIGN_IN",
  updateProfilePhoto= "UPDATE_PROFILE_PHOTO",
  signOut= "SIGN_OUT",
}

interface SignInAction {
  type: UserActionTypes.signIn,
  payload: {
    email: string,
    password: string,
  },
}

interface UpdateUserAction {
  type: UserActionTypes.updateUser,
  payload: {
    user: UserState,
  },
}

interface UpdateProfilePhotoAction {
  type: UserActionTypes.updateProfilePhoto,
  payload: {profilePicture: {uri: string}}
}

interface SignOutAction {
  type: UserActionTypes.signOut,
}

export type UserActions = SignInAction | UpdateUserAction | SignOutAction
  | UpdateProfilePhotoAction;

export interface UserState {
  user_type: "user" | "professional" | "admin";
  id: string;
  profilePicture: {uri: string};
  name: string;
	surname: string;
  mothersName: string;
	email: string;
	cellphone: string;
	cpf: string;
  birthdate: Date;
  rate: number | undefined;
  billingAddress: Address | undefined;
}
