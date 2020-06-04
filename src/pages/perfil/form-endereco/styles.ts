import {StyleSheet} from "react-native";
import {colors} from "../../../colors";

export const styles = StyleSheet.create({
	backgroundImageContent: {width: "100%", height: "100%"},
	cadastroForm: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		height: 550,
	},
	cadastroMainForm: {
		alignItems: "center",
		justifyContent: "center",
		width: 340,
		height: 510,
		backgroundColor: colors.branco,
	},
	continuarButtonText: {
		fontSize: 18,
		color: colors.branco,
		textAlign: "center",
	},
	cadastroFormSizeAndFont:
  {
  	fontSize: 18,
  	height: 45,
  	borderBottomColor: colors.verdeFinddo,
  	borderBottomWidth: 2,
  	textAlign: "left",
  	width: 300,
  },
	fontTitle: {
		fontSize: 30,
		textAlign: "center",
		fontWeight: "bold",
	},
	modalBase: {flex: 1, alignItems: "center", justifyContent: "center"},
	modalDialog: {
		padding: 16,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.8)",
		width: "100%",
		height: "80%",
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	modalDialogContent: {
		backgroundColor: colors.branco,
		width: 340,
		borderRadius: 18,
		opacity: 1,
		alignItems: "center",
	},
	modalErrosTitulo: {fontWeight: "bold", textAlign: "center", fontSize: 24},
	modalErrosSectionList: {maxHeight: "60%", width: "100%"},
	modalErrosTituloErro: {fontSize: 24, fontWeight: "bold"},
	modalErrosBotaoContinuar: {
		marginTop: 40,
		marginBottom: 10,
		width: 320,
		height: 45,
		borderRadius: 20,
		backgroundColor: colors.verdeFinddo,
		alignItems: "center",
		justifyContent: "center",
	},
	modalStyle: {flex: 1, alignItems: "center", justifyContent: "center"},
});
