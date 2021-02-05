import React, {useCallback, FC} from "react";
import {
	BottomNavigation as BottomNavigationKitten,
	BottomNavigationTab,
	Icon,
	IconProps,
} from "@ui-kitten/components";
import {SvgXml} from "react-native-svg";

import * as RootNavigation from "../routes/rootNavigation";
import {finddoLogoNavegacao} from "../assets/svg/finddo-logo-navegacao";

const PersonIcon = (props: IconProps): JSX.Element => (
	<Icon {...props} name="person-outline" />
);
const InfoIcon = (props: IconProps): JSX.Element => (
	<Icon {...props} name="question-mark-circle-outline" />
);
const ChatIcon = (props: IconProps): JSX.Element => (
	<Icon {...props} name="message-square-outline" />
);
const SettingsIcon = (props: IconProps): JSX.Element => (
	<Icon {...props} name="settings-2-outline" />
);

const Finddo = (props: IconProps): JSX.Element => (
	<SvgXml {...props} xml={finddoLogoNavegacao} width={50} height={50} />
);

const BottomNavigation: FC = ({children}) => {
	const [selectedIndex, setSelectedIndex] = React.useState(2);

	const handleSelect = useCallback((index: number) => {
		setSelectedIndex(index);
		switch (index) {
			case 0:
				RootNavigation.navigate("ChatList");
				break;

			case 1:
				RootNavigation.navigate("Profile");
				break;

			case 2:
				RootNavigation.navigate("Services");
				break;

			case 3:
				RootNavigation.navigate("Chat", {
					order_id: 170, 
					receiver_id: 1,
					title: "Suporte", 
					isAdminChat: true,
				});
				break;

			default:
				RootNavigation.openMenu();
				break;
		}
	}, []);

	return (
		<>
			{children}
			<BottomNavigationKitten
				selectedIndex={selectedIndex}
				onSelect={index => {
					handleSelect(index);
				}}
			>
				<BottomNavigationTab icon={ChatIcon} title="Chat"/>
				<BottomNavigationTab icon={PersonIcon} title="Perfil"/>
				<BottomNavigationTab icon={Finddo} />
				<BottomNavigationTab icon={InfoIcon} title="Suporte"/>
				<BottomNavigationTab icon={SettingsIcon} title="Menu"/>
			</BottomNavigationKitten>
		</>
	);
};

export default BottomNavigation;
