/* eslint-disable @typescript-eslint/naming-convention */
import { Address } from "../address/types";

export enum UserActionTypes {
  restoreSessionRequest= "RESTORE_SESSION_REQUEST",
  signInRequest= "SIGN_IN_REQUEST",
  signInSuccess= "SIGN_IN_SUCCESS",
  signOut= "SIGN_OUT",
}

export interface UserState {
  user_type: "user" | "professional";
  id: string;
  profilePicture: string;
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
