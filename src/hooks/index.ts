import {useState} from "react";
import {useTheme} from "@ui-kitten/components";
import {StackNavigationOptions} from "@react-navigation/stack";

const useSwitch = (initialSwitchState: boolean): [boolean, () => void] => {
	const [switchState, setSwitchState] = useState(initialSwitchState);

	if (!switchState === initialSwitchState) return [switchState, () => void 0];

	return [switchState, () => setSwitchState(!initialSwitchState)];
};

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
	useThemedHeaderConfig,
};
