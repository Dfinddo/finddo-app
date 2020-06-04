import {StyleSheet} from "react-native";
import {colors} from "../../../colors";

export const styles = StyleSheet.create({
	containerBase: {
		alignItems: "center",
		justifyContent: "center",
	},
	linha: {
		backgroundColor: "white",
		width: 300,
		height: 120,
		marginTop: 20,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "space-evenly",
	},
	avaliacaoFuncionario: {
		flexDirection: "row",
	},
	estrela: {width: 25, height: 25},
	horaAgendamento: {
		backgroundColor: "white",
		borderRadius: 20,
		width: 130,
		height: 100,
		justifyContent: "center",
		alignItems: "center",
	},
	profissionalACaminho: {
		backgroundColor: "white",
		borderRadius: 20,
		width: 130,
		height: 100,
		alignItems: "center",
		justifyContent: "center",
	},
	pagamentoRow: {
		height: 50,
		width: 300,
		marginTop: 20,
		alignItems: "flex-start",
		justifyContent: "space-around",
		flexDirection: "row",
	},
	pagamentoValor: {
		backgroundColor: "white",
		borderRadius: 20,
		width: 150,
		height: 50,
		justifyContent: "center",
		alignItems: "center",
	},
	modalStyle: {flex: 1, alignItems: "center", justifyContent: "center"},
	cadastroFormSizeAndFont:
  {
  	fontSize: 18,
  	height: 45,
  	borderBottomColor: colors.verdeFinddo,
  	borderBottomWidth: 2,
  	textAlign: "left",
  	width: 300,
  },
});
