import React, {FC} from "react";
import {Layout, Divider, Text} from "@ui-kitten/components";
import {
	StyleSheet,
	Pressable,
	PressableProps,
	StyleProp,
	ViewStyle,
} from "react-native";

interface DataPieceDisplayProps extends Omit<PressableProps, "children"> {
	hint: string;
	value: string;
	style?: StyleProp<ViewStyle>;
}

const DataPieceDisplay: FC<DataPieceDisplayProps> = props => {
	const {style, hint, value, ...pressableProps} = props;

	return (
		<Pressable {...pressableProps}>
			<Layout level="1" style={[styles.container, style]}>
				<Text appearance="hint" category="s1">
					{hint}
				</Text>
				<Text category="s1">{value}</Text>
			</Layout>
			<Divider />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 13,
	},
});

export default DataPieceDisplay;
