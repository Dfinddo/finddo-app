import React from "react";
import {useAuth} from "hooks";
import AppRoute from "./app";
import AuthRoute from "./auth";
import {observer} from "mobx-react-lite";

const Routes = observer(() => {
	const authStore = useAuth();

	return authStore.id ? <AppRoute /> : <AuthRoute />;
});

export default Routes;
