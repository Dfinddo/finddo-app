/* eslint-disable no-console */
/* eslint-disable line-comment-position */
/* eslint-disable no-inline-comments */
import { ONE_SIGNAL_APP_ID } from "@env";
import OneSignal from "react-native-onesignal";

interface ResultsNotification {
	notification: {
		payload: {
			body: string;
			additionalData: string;
		};
		isAppInFocus: boolean;
	}	
}

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

export function initNotification(): void {
  OneSignal.setLogLevel(6, 0);

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
}

export function removeEventListener(): void {
  OneSignal.removeEventListener('received', onReceived);
	OneSignal.removeEventListener('opened', onOpened);
	OneSignal.removeEventListener('ids', onIds);
}

export function setExternalUserId(id: string): void {
  OneSignal.setExternalUserId(id);
}

  
