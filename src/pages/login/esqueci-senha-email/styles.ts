import {StyleSheet} from "react-native";
import {colors} from "../../../colors";

export const styles = StyleSheet.create({
	backgroundImageContent: {width: "100%", height: "100%"},
	emailForm: {flex: 1, alignItems: "center", justifyContent: "center", height: 240},
	fontTitle: {
		fontSize: 30,
		textAlign: "center",
		fontWeight: "bold",
	},
	formSizeAndFont:
  {
  	fontSize: 18,
  	height: 45,
  	borderBottomColor: colors.verdeFinddo,
  	borderBottomWidth: 2,
  	textAlign: "left",
  	width: 300,
  },
	continuarButton: {
		marginTop: 40,
		marginBottom: 10,
		width: 360,
		height: 45,
		borderRadius: 20,
		backgroundColor: colors.verdeFinddo,
		alignItems: "center",
		justifyContent: "center",
	},
	continuarButtonText: {
		fontSize: 18,
		color: colors.branco,
		textAlign: "center",
	},
	containerForm: {
		alignItems: "center",
		justifyContent: "center",
		height: 160,
		width: "100%",
		backgroundColor: colors.branco,
	},
});
