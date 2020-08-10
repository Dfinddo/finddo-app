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

const App: FC = () => {
	const userStore = useUser();

	useEffect(() => {
		userStore.restoreSession();
	}, [userStore]);

	return (
		<NavigationContainer>
			<IconRegistry icons={EvaIconsPack} />
			<ThemeProvider {...eva} theme={finddoLightTheme}>
				<Routes />
			</ThemeProvider>
		</NavigationContainer>
	);
};

export default App;
