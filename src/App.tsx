/* eslint-disable no-console */
/* eslint-disable line-comment-position */
/* eslint-disable no-inline-comments */
import "react-native-gesture-handler";

import React, {useEffect, FC} from "react";
import OneSignal from 'react-native-onesignal'; 
import { Provider, useDispatch, useSelector } from 'react-redux';
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
import store, { State } from './stores';

import { ONE_SIGNAL_APP_ID } from "@env";
import { UserState } from "stores/modules/user/types";
import { restoreSession } from "stores/modules/user/actions";

const App: FC = () => 
	// const userStore = useUser()

	 (
		<NavigationContainer ref={navigationRef}>
			<IconRegistry icons={EvaIconsPack} />
			<Provider store={store}>
				<ThemeProvider {...eva} theme={finddoLightTheme}>
					<Routes />
				</ThemeProvider>
			</Provider>
		</NavigationContainer>
	)

;

export default App;
