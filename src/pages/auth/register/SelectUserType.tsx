import React, {FC} from "react";
import {StyleSheet} from "react-native";
import {Button, Text, Layout} from "@ui-kitten/components";
import {useUser} from "hooks";
import {StackScreenProps} from "@react-navigation/stack";
import {RegisterStackParams} from "src/routes/auth";

type SelectUserTypeScreenProps = StackScreenProps<
	RegisterStackParams,
	"SelectUserType"
>;

const SelectUserType: FC<SelectUserTypeScreenProps> = ({navigation}) => {
	const userStore = useUser();
	const advance = (userType: "user" | "professional") => () => {
		userStore.userType = userType;
		navigation.navigate("UserDataForm");
	};

	return (
		<Layout level="2" style={styles.container}>
			<Layout style={styles.contentWrapper}>
				<Text style={styles.fontTitle}>Quero ser:</Text>
				<Button onPress={advance("user")}>CLIENTE FINDDO</Button>
				<Button onPress={advance("professional")}>
					PROFISSIONAL FINDDO
				</Button>
			</Layout>
		</Layout>
	);
};

export default SelectUserType;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		justifyContent: "center",
	},
	contentWrapper: {
		padding: 10,
		height: "40%",
		justifyContent: "space-around",
	},
	fontTitle: {
		fontSize: 30,
		textAlign: "center",
		fontWeight: "bold",
	},
});
