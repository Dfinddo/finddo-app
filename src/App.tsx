import "react-native-gesture-handler";
import "mobx-react-lite/batchingForReactNative";
import React, {useEffect} from "react";
import {NavigationContainer} from "@react-navigation/native";
import {
	ApplicationProvider as ThemeProvider,
	IconRegistry,
} from "@ui-kitten/components";
import {EvaIconsPack} from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";
import {finddoLightTheme, finddoDarkTheme} from "themes";
import Routes from "routes";
import {AuthProvider} from "components/providers/auth-provider";

const App = (): JSX.Element => (

	<NavigationContainer>
		<IconRegistry icons={EvaIconsPack} />
		<ThemeProvider {...eva} theme={finddoLightTheme}>
			<AuthProvider>
				<Routes />
			</AuthProvider>
		</ThemeProvider>
	</NavigationContainer>
);

export default App;
