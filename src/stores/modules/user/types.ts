/* eslint-disable @typescript-eslint/naming-convention */
import { Address } from "../adresses/types";

export enum UserActionTypes {
  updateUser= "UPDATE_USER",
  // signInSuccess= "SIGN_IN_SUCCESS",
  updateProfilePhoto= "UPDATE_PROFILE_PHOTO",
  signOut= "SIGN_OUT",
}

export interface UserState {
  user_type: "user" | "professional";
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
