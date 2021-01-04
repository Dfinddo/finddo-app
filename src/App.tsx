import "react-native-gesture-handler";

import React, {useEffect, FC} from "react";
import { Provider } from 'react-redux';
import {NavigationContainer} from "@react-navigation/native";
import {
	ApplicationProvider as ThemeProvider,
	IconRegistry,
} from "@ui-kitten/components";
import {EvaIconsPack} from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";
import {finddoLightTheme} from "themes";
import Routes from "routes";
import {navigationRef} from "./routes/rootNavigation";
import store from './stores';
import { initNotification, removeEventListener } from "./services/onesignal";

const App: FC = () => {
	useEffect(() => {
		initNotification();
		
		return () => removeEventListener()
	}, []);

	return (
		<NavigationContainer ref={navigationRef}>
			<IconRegistry icons={EvaIconsPack} />
			<Provider store={store}>
				<ThemeProvider {...eva} theme={finddoLightTheme}>
					<Routes />
				</ThemeProvider>
			</Provider>
		</NavigationContainer>
	);
};

export default App;
