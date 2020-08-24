import React from "react";
import {useUser} from "hooks";
import AppRoute from "./app";
import AuthRoute from "./auth";
import {observer} from "mobx-react-lite";
import BottomNavigation from "components/BottomNavigationTab";

const Routes = observer(() => {
	const userStore = useUser();

	return userStore.id ? (
		<>
			<AppRoute />
			<BottomNavigation />
		</>
	) : (
		<AuthRoute />
	);
});

export default Routes;
