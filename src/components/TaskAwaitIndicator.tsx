import React, {FC} from "react";
import {useTheme, StyleService, useStyleSheet} from "@ui-kitten/components";
import {ViewProps, ActivityIndicator, Modal, View} from "react-native";

interface TaskAwaitIndicatorProps extends ViewProps {
	isAwaiting?: boolean;
}

const TaskAwaitIndicator: FC<TaskAwaitIndicatorProps> = props => {
	const theme = useTheme();
	const styles = useStyleSheet(themedStyles);

	return (
		<Modal visible={props.isAwaiting} transparent>
			<View style={styles.container}>
				<ActivityIndicator
					size="large"
					color={theme["color-primary-active"]}
					animating={true}
				/>
			</View>
		</Modal>
	);
};

const themedStyles = StyleService.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "color-basic-control-transparent-100",
	},
});

export default TaskAwaitIndicator;
