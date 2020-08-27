import React, {useEffect, useState} from "react";
import {View, Alert, StyleSheet, ImageBackground} from "react-native";
import {
	Text,
	Button,
	Layout,
	StyleService,
	useStyleSheet,
} from "@ui-kitten/components";
import {useServiceList} from "hooks";
import {SvgXml} from "react-native-svg";
import {observer} from "mobx-react-lite";
import {StackScreenProps} from "@react-navigation/stack";
import {ServicesStackParams} from "src/routes/app";
import ServiceStore from "stores/service-store";
import ValidatedMaskedInput from "components/ValidatedMaskedInput";
import {priceFormatter, numericFormattingFilter} from "utils";

import {finddoLogo} from "../../../assets/svg/finddo-logo";

type ServiceBudgetScreenProps = StackScreenProps<
	ServicesStackParams,
	"ServiceBudget"
>;

const ServiceBudget = observer<ServiceBudgetScreenProps>(
	({route, navigation}) => {
		const styles = useStyleSheet(themedStyles);
		const [serviceStore, setServiceStore] = useState<
			ServiceStore | undefined
		>();
		const [price, setPrice] = useState("");
		const [finddoTax, setFinddoTax] = useState("");
		const [total, setTotal] = useState("");
		const [isLoading, setIsLoading] = useState(false);
		const serviceListStore = useServiceList();

		useEffect(() => {
			if (route.params?.id)
				setServiceStore(
					serviceListStore.list.find(({id}) => route.params.id === id),
				);
		}, [route.params?.id, serviceListStore.list]);

		const updateBudget = (price: string): void => {
			if (price === "") {
				setFinddoTax("");

				return;
			}
			setPrice(price);

			const value: number = parseInt(price, 10);

			const tax: number =
				// eslint-disable-next-line no-nested-ternary
				value < 8000
					? value / 4
					: value < 50000
					? value / 5
					: (value * 3) / 20;

			setFinddoTax(Math.floor(tax).toString());

			const total = value + Math.floor(tax);

			total === 0 ? setTotal("") : setTotal(total.toString());
		};

		if (serviceStore === void 0) return null;

		return (
			<ImageBackground
				style={styles.backgroundImageContent}
				source={require("assets/Ellipse.png")}
			>
				<SvgXml xml={finddoLogo} width={"45%"} height={"10%"} />
				<Layout level="1" style={styles.layout}>
					<Text style={styles.title}>Cálculo do serviço</Text>
					<View style={styles.viewInput}>
						<ValidatedMaskedInput
							style={styles.input}
							formatter={priceFormatter}
							formattingFilter={numericFormattingFilter}
							onChangeText={input => {
								updateBudget(input);
							}}
							keyboardType={"number-pad"}
							value={price}
							maxLength={11}
						/>
						<Text style={styles.text}>(Serviço)</Text>
					</View>
					<View style={styles.viewInput}>
						<ValidatedMaskedInput
							style={styles.input}
							formatter={priceFormatter}
							formattingFilter={numericFormattingFilter}
							disabled
							value={finddoTax}
							maxLength={11}
						/>
						<Text style={styles.text}>(Finddo)</Text>
					</View>
					<View style={styles.viewTotal}>
						<Text style={styles.textTotal}>
							TOTAL:{"    "}
							<Text style={styles.textPrice}>
								{priceFormatter(total)}
							</Text>
						</Text>
					</View>
					<Button>ORÇAR</Button>
				</Layout>
			</ImageBackground>
		);
	},
);

export default ServiceBudget;

const themedStyles = StyleService.create({
	backgroundImageContent: {
		width: "100%",
		height: "100%",
		alignItems: "center",
		paddingVertical: "5%",
	},
	layout: {
		width: "85%",
		marginTop: "15%",
		borderRadius: 8,
		padding: "5%",
	},
	title: {
		fontSize: 24,
		alignSelf: "center",
		fontWeight: "bold",
		paddingBottom: 8,
	},
	viewInput: {
		alignItens: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		marginTop: 16,
	},
	input: {
		backgroundColor: "transparent",
		borderBottomColor: "color-primary-default",
		borderTopColor: "transparent",
		borderRightColor: "transparent",
		borderLeftColor: "transparent",
		width: "78%",
	},
	text: {
		color: "color-primary-default",
		fontSize: 16,
		marginTop: 8,
	},
	viewTotal: {
		width: "80%",
		alignSelf: "center",
		padding: 32,
	},
	textTotal: {
		fontSize: 16,
		color: "grey",
		alignSelf: "center",
	},
	textPrice: {
		fontSize: 20,
		color: "color-primary-default",
	},
});
