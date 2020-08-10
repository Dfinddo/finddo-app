import {useState, useContext} from "react";
import {UserContext} from "components/providers/user-provider";
import {ServiceContext} from "components/providers/service-provider";
import {AddressListContext} from "components/providers/address-list-store";
import UserStore from "stores/user-store";
import ServiceStore from "stores/service-store";
import AddressListStore from "stores/address-list-store";
import {ServiceListContext} from "components/providers/service-list-provider";
import ServiceListStore from "stores/service-list-store";
import {useTheme} from "@ui-kitten/components";
import {StackNavigationOptions} from "@react-navigation/stack";

const useSwitch = (initialSwitchState: boolean): [boolean, () => void] => {
	const [switchState, setSwitchState] = useState(initialSwitchState);

	if (!switchState === initialSwitchState) return [switchState, () => void 0];

	return [switchState, () => setSwitchState(!initialSwitchState)];
};

// Context Hooks
const useService = (): ServiceStore => useContext(ServiceContext);
const useServiceList = (): ServiceListStore => useContext(ServiceListContext);
const useUser = (): UserStore => useContext(UserContext);
const useAddressList = (): AddressListStore => useContext(AddressListContext);

// Theme Hooks
const useThemedHeaderConfig = (): StackNavigationOptions => {
	const theme = useTheme();

	const screenOptions = {
		headerStyle: {
			backgroundColor: theme["background-basic-color-1"],
		},
		headerTintColor: theme["text-basic-color"],
	};

	return screenOptions;
};

export {
	useSwitch,
	useService,
	useServiceList,
	useUser,
	useAddressList,
	useThemedHeaderConfig,
};
