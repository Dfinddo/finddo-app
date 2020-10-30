/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {useUser} from "hooks";
import AppRoute from "./app";
import AuthRoute from "./auth";
import {observer} from "mobx-react-lite";
import BottomNavigation from "components/BottomNavigationTab";
import {KeyboardAvoidingView, Platform} from "react-native";

const Routes = observer(() => {
	const userStore = useUser();

	return userStore.id ? (
		<>
			<BottomNavigation>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					keyboardVerticalOffset={Platform.OS === "ios" ? 200 : void 0}
					style={{flex: 1}}
				>
					<AppRoute />
				</KeyboardAvoidingView>
			</BottomNavigation>
		</>
	) : (
		<AuthRoute />
	);
});

export default Routes;
