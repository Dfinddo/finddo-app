import {useState, useContext} from "react";
import {AuthContext} from "components/providers/auth-provider";
import {ServiceContext} from "components/providers/service-provider";
import {AddressListContext} from "components/providers/address-list-store";
import AuthStore from "stores/auth-store";
import ServiceStore from "stores/service-store";
import AddressListStore from "stores/address-list-store";
import {ServiceListContext} from "components/providers/service-list-provider";
import ServiceListStore from "stores/service-list-store";

const useSwitch = (initialSwitchState: boolean): [boolean, () => void] => {
	const [switchState, setSwitchState] = useState(initialSwitchState);

	if (!switchState === initialSwitchState) return [switchState, () => void 0];

	return [switchState, () => setSwitchState(!initialSwitchState)];
};

// Context hooks
const useService = (): ServiceStore => useContext(ServiceContext);
const useServiceList = (): ServiceListStore => useContext(ServiceListContext);
const useAuth = (): AuthStore => useContext(AuthContext);
const useAddressList = (): AddressListStore => useContext(AddressListContext);

export {useSwitch, useService, useServiceList, useAuth, useAddressList};
