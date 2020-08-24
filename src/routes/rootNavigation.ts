/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as React from "react";
import {NavigationContainerRef, DrawerActions} from "@react-navigation/native";

export const navigationRef = React.createRef<NavigationContainerRef>();

export function navigate(name: string, params?: any): void {
	navigationRef.current?.navigate(name, params);
}

export function openMenu(): void {
	navigationRef.current?.dispatch(DrawerActions.openDrawer());
}
