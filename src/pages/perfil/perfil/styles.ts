import {StyleSheet} from "react-native";
import {colors} from "../../../colors";

export const styles = StyleSheet.create({
	modalStyle: {flex: 1, alignItems: "center", justifyContent: "center"},
	backgroundImageContent: {width: "100%", height: "100%"},
	sairButton: {
		marginTop: 10,
		width: 340,
		height: 45,
		borderRadius: 20,
		backgroundColor: colors.verdeFinddo,
		alignItems: "center",
		justifyContent: "center",
	},
	sairButtonText: {
		fontSize: 18,
		color: colors.branco,
		textAlign: "center",
	},
	perfilFormSizeAndFont:
  {
  	fontSize: 18,
  	height: 45,
  	textAlign: "left",
  	width: "80%",
  	paddingLeft: 20,
  },
	perfilEnderecoSelect:
  {
  	fontSize: 18,
  	height: 45,
  	textAlign: "center",
  	width: 300,
  	textDecorationLine: "underline",
  	textAlignVertical: "bottom",
  },
	loaderContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(255,255,255,0.5)",
	},
});
