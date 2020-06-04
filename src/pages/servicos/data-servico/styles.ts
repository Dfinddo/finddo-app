import {StyleSheet} from "react-native";
import {colors} from "../../../colors";

export const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.branco,
		marginTop: 15,
	},
	backgroundImageContent: {width: "100%", height: "100%"},
	selectStyle: {
		borderStyle: "solid",
		width: 120,
		borderWidth: 2,
		borderColor: colors.verdeFinddo,
	},
	continuarButton:
  {
  	width: 340,
  	height: 45,
  	borderRadius: 20,
  	backgroundColor: colors.verdeFinddo,
  	alignItems: "center",
  	justifyContent: "center",
  },
	continuarButtonText:
  {
  	fontSize: 18,
  	color: colors.branco,
  	textAlign: "center",
  },
	modalDialogContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(255,255,255,0.5)",
	},
	modalDialogContent: {
		backgroundColor: colors.branco,
		width: 340,
		borderRadius: 18,
		opacity: 1,
		alignItems: "center",
	},
	modalErrosTitulo: {fontWeight: "bold", textAlign: "center", fontSize: 24},
	modalErrosContent: {
		fontSize: 18, marginVertical: 10,
	},
	modalErrosVoltarButton: {
		width: 320,
		height: 45,
		backgroundColor: colors.verdeFinddo,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 20,
		marginBottom: 10,
	},
	definirDataHoraContainer: {
		marginTop: 30,
		width: 340,
		height: 55,
		flexDirection: "row",
		alignContent: "center",
		justifyContent: "space-around",
	},
});
