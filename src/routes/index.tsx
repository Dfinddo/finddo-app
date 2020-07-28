import React from "react";
import {useUser} from "hooks";
import AppRoute from "./app";
import AuthRoute from "./auth";
import {observer} from "mobx-react-lite";

const Routes = observer(() => {
	const userStore = useUser();

	return userStore.id ? <AppRoute /> : <AuthRoute />;
});

export default Routes;
