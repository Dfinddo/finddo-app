import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
	accordionFechadoEstadoInativo: {
		height: 40,
		justifyContent: "center",
	},
	accordionFechadoTextEstadoInativo: {
		fontSize: 18,
		color: "gray",
	},
	accordionFechadoEstadoAtivo: {
		height: 40,
		width: 270,
		borderRadius: 10,
		backgroundColor: "white",
		paddingLeft: 8,
	},
	accordionFechadoConteudoEstadoAtivo: {
		flex: 1,
		flexDirection: "row",
		width: 270,
		alignItems: "center",
	},
	accordionFechadoConteudoEstadoAtivoText: {
		fontSize: 20, width: 235,
	},
	accordionAberto: {
		height: 170,
		backgroundColor: "white",
		width: 270,
		borderRadius: 10,
	},
	accordionAbertoConteudo: {
		flex: 1,
		flexDirection: "row",
		width: 270,
		alignItems: "flex-start",
		paddingTop: 9,
	},
	accordionAbertoProfissionalFoto: {
		width: 90,
		height: 110,
		alignItems: "center",
		justifyContent: "center",
	},
	accordionAbertoProfissionalInfo: {
		width: 180,
		height: 110,
		alignItems: "flex-start",
		justifyContent: "center",
		paddingLeft: 8,
	},
	accordionAbertoEstrelas: {
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
	},
	accordionAbertoEstrela: {
		width: 20,
		height: 20,
		marginRight: 5,
	},
	margemPreenchimento: {height: 80},
	accordionAbertoProfissional: {paddingLeft: 8, height: 40},
});
