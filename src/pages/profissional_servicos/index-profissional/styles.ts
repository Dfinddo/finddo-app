import {StyleSheet} from "react-native";
import {colors} from "../../../colors";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 22,
		alignItems: "center",
	},
	item: {
		padding: 10,
		fontSize: 35,
		height: 70,
	},
	pedidoLabel: {
		borderRadius: 12,
		backgroundColor: colors.branco,
		marginBottom: 10,
		width: 340,
		alignItems: "center",
		justifyContent: "flex-start",
		flexDirection: "row",
	},
	pedidoIndicador: {
		width: 20,
		height: 20,
		borderRadius: 40,
		borderColor: colors.bordaIconeStatus,
		backgroundColor: colors.verdeEscuroStatus,
		borderWidth: 1,
	},
	pedidoSetaDireita: {
		width: 40,
		height: 40,
		flex: 1,
		alignItems: "flex-end",
		justifyContent: "center",
	},
	novoPedidoButton: {
		backgroundColor: colors.verdeFinddo,
		height: 45,
		width: 340,
		borderRadius: 20,
		color: colors.branco,
		alignItems: "center",
		justifyContent: "center",
	},
});
