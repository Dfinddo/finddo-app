/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosResponse } from "axios";
import finddoApi, { UserApiResponse } from "finddo-api";
import OneSignal from "react-native-onesignal";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { State } from "../../";
import { signInRequest, signInSuccess } from "./actions";
import { UserActionTypes, UserState } from "./types";

type CheckCredencialsRequest = ReturnType<typeof signInRequest>

interface LoginResponse {
  jwt: string;
  user: {
    data: {
      id: string;
      attributes: UserApiResponse;
    };
  };
}

function* sessionConfig() {
  const sessionConfigCall = async (): Promise<void> => {
    const [userData, jwt] = (
      await AsyncStorage.multiGet(["user", "access-token"])
    ).map(([, value]) => value && JSON.parse(value));
  
    if (!userData || !jwt) return;
  
    finddoApi.defaults.headers.Authorization = `Bearer ${jwt}`;
    
    put(signInSuccess(userData)); 
  };

  try {
    yield call(sessionConfigCall)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log({error});
    if (error.response) throw new Error("Invalid credentials");
    else if (error.request) throw new Error("Connection error");
    else throw error;
  }
};

function* checkCredencials({payload}: CheckCredencialsRequest) {
  const {email, password} = payload;

  const signInCall = () => {
    finddoApi.post("login", {
      email, 
      password,
    }).then((response: AxiosResponse<LoginResponse>) => {
      const {jwt} = response.data;
      const {id, attributes: user} = response.data.user.data;
    
      if (user.activated === false) throw new Error("Account not validated");
        
      finddoApi.defaults.headers.Authorization = `Bearer ${jwt}`;


      const logged = Object.assign(user, {id});
    
      AsyncStorage.setItem("access-token", JSON.stringify(jwt));
      AsyncStorage.setItem("user", JSON.stringify(logged));
    
      OneSignal.getPermissionSubscriptionState(async(status: {userId: string}) => {
        await finddoApi.get('users/set_player_id', {
          params: {
            player_id: status.userId,
          }
        });
      });

      put(signInSuccess(logged));  
    });
  }

  try {
    yield call(signInCall);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log({error});
    if (error.response) throw new Error("Invalid credentials");
    else if (error.request) throw new Error("Connection error");
    else throw error;
  }
}

function* signOutClear() {
  yield AsyncStorage.multiRemove(["user", "access-token"]);

  const id: string = yield select((state: State) => state.userStore.id);

	OneSignal.getPermissionSubscriptionState(async(status: {userId: string}) => {
		await finddoApi.delete(
			`users/remove_player_id_notifications/${id}/${status.userId}`,
		);
	});

	OneSignal.removeExternalUserId();

	delete finddoApi.defaults.headers.Authorization;
}

export default all([
  takeLatest(UserActionTypes.restoreSessionRequest, sessionConfig),
  takeLatest(UserActionTypes.signInRequest, checkCredencials),
  takeLatest(UserActionTypes.signOut, signOutClear),
]);