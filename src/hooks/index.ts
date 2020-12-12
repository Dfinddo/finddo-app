import {useState, useContext} from "react";
import {useTheme} from "@ui-kitten/components";
import {StackNavigationOptions} from "@react-navigation/stack";

import {UserContext} from "components/providers/user-provider";
import {ServiceContext} from "components/providers/service-provider";
import {CardListContext} from "components/providers/card-list-provider";
import {ChatContext} from "components/providers/chat-provider";
import {AddressListContext} from "components/providers/address-list-provider";
import {ServiceListContext} from "components/providers/service-list-provider";
import {ProfessionalListContext} from "components/providers/professional-list-provider";

import UserStore from "stores/user-store";
import ServiceStore from "stores/service-store";
import CardListStore from "stores/card-list-store";
import ChatStore from "stores/chat-store";
import AddressListStore from "stores/address-list-store";
import ServiceListStore from "stores/service-list-store";
import ProfessionalListStore from "stores/professional-list-store";

const useSwitch = (initialSwitchState: boolean): [boolean, () => void] => {
	const [switchState, setSwitchState] = useState(initialSwitchState);

	if (!switchState === initialSwitchState) return [switchState, () => void 0];

	return [switchState, () => setSwitchState(!initialSwitchState)];
};

// Context Hooks
const useUser = (): UserStore => useContext(UserContext);
const useService = (): ServiceStore => useContext(ServiceContext);
const useCardList = (): CardListStore => useContext(CardListContext);
const useChat = (): ChatStore => useContext(ChatContext);
const useAddressList = (): AddressListStore => useContext(AddressListContext);
const useServiceList = (): ServiceListStore => useContext(ServiceListContext);
const useProfessionalList = (): ProfessionalListStore => useContext(ProfessionalListContext);

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
	useUser,
	useSwitch,
	useService,
	useChat,
	useCardList,
	useServiceList,
	useAddressList,
	useProfessionalList,
	useThemedHeaderConfig,
};
