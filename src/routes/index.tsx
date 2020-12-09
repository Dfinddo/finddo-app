/* eslint-disable line-comment-position */
/* eslint-disable no-inline-comments */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from "react";
import {useUser} from "hooks";
import AppRoute from "./app";
import AuthRoute from "./auth";
import {observer} from "mobx-react-lite";
import BottomNavigation from "components/BottomNavigationTab";
import {KeyboardAvoidingView, Platform, View} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../stores";
import { UserState } from "stores/modules/user/types";
import { restoreSession } from "stores/modules/user/actions";
import OneSignal from "react-native-onesignal";
import { ONE_SIGNAL_APP_ID } from "@env";

interface ResultsNotification {
	notification: {
		payload: {
			body: string;
			additionalData: string;
		};
		isAppInFocus: boolean;
	}	
}

const Routes = observer(() => {
	// const userStore = useUser();
	const dispatch = useDispatch();
	const userStore = useSelector<State, UserState>(state => state.userStore);

	function onReceived(notification: string ): void {
    console.log("Notification received: ", notification);
  }

  function onOpened(openResult: ResultsNotification): void {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  function onIds(device: string): void {
    console.log('Device info: ', device);
  }

	// function myiOSPromptCallback(permission){
	// 		// do something with permission value
	// }

	useEffect(() => {
		dispatch(restoreSession());
		
		OneSignal.setLogLevel(6, 0);
  
		OneSignal.init(ONE_SIGNAL_APP_ID, {
			kOSSettingsKeyAutoPrompt : false, 
			kOSSettingsKeyInAppLaunchURL: false, 
			kOSSettingsKeyInFocusDisplayOption:2
		});

		OneSignal.setExternalUserId(userStore.id);

		OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.
		
		// The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
		// OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback);

		OneSignal.addEventListener('received', onReceived);
		OneSignal.addEventListener('opened', onOpened);
		OneSignal.addEventListener('ids', onIds);
		
		return () => {
			OneSignal.removeEventListener('received', onReceived);
			OneSignal.removeEventListener('opened', onOpened);
			OneSignal.removeEventListener('ids', onIds);
		}
	}, [userStore, dispatch]);

	if(!userStore) return <View></View>

	return userStore.id ? (
		<View>
			<BottomNavigation>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					keyboardVerticalOffset={Platform.OS === "ios" ? 200 : void 0}
					style={{flex: 1}}
				>
					<AppRoute />
				</KeyboardAvoidingView>
			</BottomNavigation>
		</View>
	) : (
		<AuthRoute />
	);
});

export default Routes;
