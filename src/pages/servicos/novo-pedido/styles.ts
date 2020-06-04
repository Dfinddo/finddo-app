import {StyleSheet} from "react-native";
import {colors} from "../../../colors";

export const styles = StyleSheet.create({
	backgroundImageContent: {width: "100%", height: "100%"},
	pedidoForm: {flex: 1, alignItems: "center", justifyContent: "flex-start"},
	horizontalPadding: {paddingHorizontal: 10},
	pedidoFormSizeAndFont:
  {
  	fontSize: 25,
  	height: 200,
  	textAlignVertical: "top",
  	paddingLeft: 16,
  	paddingRight: 16,
  	marginTop: 16,
  	borderStyle: "solid",
  	borderWidth: 2,
  	borderColor: colors.verdeFinddo,
  	width: "100%",
  },
	continuarButtonContainer: {
		marginVertical: 10,
		width: "100%",
		height: 45,
		alignItems: "center",
		justifyContent: "center",
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
	fontTitle: {
		fontSize: 30,
	},
	selectStyle: {
		borderStyle: "solid",
		width: "100%",
		borderWidth: 2,
		borderColor: colors.verdeFinddo,
		marginTop: 16,
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
	modalDialogContent: {backgroundColor: colors.branco, width: 340, borderRadius: 18, opacity: 1, alignItems: "center"},
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
	selectUrgenciaContainer: {
		height: 60,
		borderWidth: 2,
		borderColor: colors.verdeFinddo,
		marginTop: 10,
	},
});
