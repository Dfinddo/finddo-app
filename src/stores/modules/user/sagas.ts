/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
import { BACKEND_URL_STORAGE } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import finddoApi from "finddo-api";
import { Alert } from "react-native";
import OneSignal from "react-native-onesignal";
import { all, call, CallEffect, put, select, takeLatest } from "redux-saga/effects";
import { setLoading } from "../application/actions";
import { signIn, updateUser } from "./actions";
import { UserActionTypes } from "./types";

type SessionConfigsRequest = ReturnType<typeof signIn>

function* sessionConfigs ({payload}: SessionConfigsRequest) {
  const {email, password} = payload;

  yield put(setLoading(true));

  try {
    const response = yield call(finddoApi.post, "login", {email, password});

    const {jwt, photo} = response.data;
    const {id, attributes: user} = response.data.user.data;
    
    if (user.activated === false) throw new Error("Account not validated");
        
    finddoApi.defaults.headers.Authorization = `Bearer ${jwt}`;

    const logged = Object.assign(user, {id, profilePicture: photo.photo ? {
      uri: `${BACKEND_URL_STORAGE}${photo.photo}`,
    }: require("../../../assets/sem-foto.png")});
    
    AsyncStorage.setItem("access-token", JSON.stringify(jwt));
    AsyncStorage.setItem("user", JSON.stringify(logged));
    
    OneSignal.getPermissionSubscriptionState(async(status: {userId: string}) => {
      await finddoApi.get('users/set_player_id', {
        params: {
          player_id: status.userId,
        }
      });
    });
    yield put(updateUser(logged));
  } catch (error) {
    if (error.response.data.error === "Log in failed! Username or password invalid!")
      Alert.alert("Email ou senha incorretos");
    else if (error.message === "Connection error")
      Alert.alert("Falha ao conectar");
    else if (error.message === "Account not validated")
      Alert.alert("Sua conta ainda não foi validada.");
    else throw error;
  }finally{
    yield put(setLoading(false));
  }
}

export default all([
  takeLatest(UserActionTypes.signIn,sessionConfigs),
]);