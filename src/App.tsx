/* eslint-disable no-console */
/* eslint-disable line-comment-position */
/* eslint-disable no-inline-comments */
import "react-native-gesture-handler";
import "mobx-react-lite/batchingForReactNative";
import React, {useEffect, FC} from "react";
import {NavigationContainer} from "@react-navigation/native";
import {
	ApplicationProvider as ThemeProvider,
	IconRegistry,
} from "@ui-kitten/components";
import {EvaIconsPack} from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";
import {finddoLightTheme, finddoDarkTheme} from "themes";
import Routes from "routes";
import {useUser} from "hooks";
import {navigationRef} from "./routes/rootNavigation";
import OneSignal from 'react-native-onesignal'; 
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

const App: FC = () => {
	const userStore = useUser();

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
		userStore.restoreSession();
		
		OneSignal.setLogLevel(6, 0);
  
		// Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
		OneSignal.init(ONE_SIGNAL_APP_ID, {
			kOSSettingsKeyAutoPrompt : false, 
			kOSSettingsKeyInAppLaunchURL: false, 
			kOSSettingsKeyInFocusDisplayOption:2
		});

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
	}, [userStore]);

	return (
		<NavigationContainer ref={navigationRef}>
			<IconRegistry icons={EvaIconsPack} />
			<ThemeProvider {...eva} theme={finddoLightTheme}>
				<Routes />
			</ThemeProvider>
		</NavigationContainer>
	);
};

export default App;
