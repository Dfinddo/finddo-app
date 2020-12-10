import React, { useCallback, useEffect } from "react";
import AppRoute from "./app";
import AuthRoute from "./auth";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../stores";
import { UserState } from "stores/modules/user/types";
import { signInSuccess } from "stores/modules/user/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import finddoApi from "finddo-api";
import BottomNavigation from "components/BottomNavigationTab";

const Routes = (): JSX.Element => {
	const dispatch = useDispatch();
	const userStore = useSelector<State, UserState>(state => state.user);

	const restoreSession = useCallback(async () => {
		const [userData, jwt] = (
			await AsyncStorage.multiGet(["user", "access-token"])
		).map(([, value]) => value && JSON.parse(value));

		if (!userData || !jwt) return;

		finddoApi.defaults.headers.Authorization = `Bearer ${jwt}`;
		dispatch(signInSuccess(userData));
	}, [dispatch]);

	useEffect(() => void restoreSession(), [restoreSession]);
	
	return userStore.id ? (
		<>
			<AppRoute />
			<BottomNavigation />
		</>
	) : (
		<AuthRoute />
	);
};

export default Routes;
