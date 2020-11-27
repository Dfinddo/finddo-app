import "react-native-gesture-handler";
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
import { configure } from "mobx"

configure({
		// useProxies: "never",
		// enforceActions: "always",
		enforceActions: 'observed',
    computedRequiresReaction: true,
    reactionRequiresObservable: true,
    observableRequiresReaction: true,
    // disableErrorBoundaries: true
})

const App: FC = () => {
	const userStore = useUser();

	useEffect(() => {
		userStore.restoreSession();
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
