/* eslint-disable @typescript-eslint/naming-convention */
import React, {useEffect, useState, useCallback} from "react";
import {View, Alert, ScrollView, ImageBackground} from "react-native";
import {
	Text,
	Button,
	Layout,
	StyleService,
	useStyleSheet,
} from "@ui-kitten/components";
import {SvgXml} from "react-native-svg";
import {StackScreenProps} from "@react-navigation/stack";
import {ServicesStackParams} from "src/routes/app";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import ValidatedMaskedInput from "components/ValidatedMaskedInput";
import {priceFormatter, numericFormattingFilter} from "utils";

import {finddoLogo} from "../../../assets/svg/finddo-logo";
import { useDispatch } from "react-redux";
import finddoApi from "finddo-api";
import { updateService } from "stores/modules/services/actions";

type ServiceBudgetScreenProps = StackScreenProps<
	ServicesStackParams,
	"ServiceBudget"
>;

const ServiceBudget = (
	{route, navigation}: ServiceBudgetScreenProps): JSX.Element => {
		const {id} = route.params;
		const styles = useStyleSheet(themedStyles);
		const [price, setPrice] = useState(0);
		const [finddoTax, setFinddoTax] = useState(0);
		const [productPrice, setProductPrice] = useState(0);
		const [total, setTotal] = useState("");
		const [isLoading, setIsLoading] = useState(false);

		const dispatch = useDispatch();

		useEffect(() => {
			const tax: number =
				// eslint-disable-next-line no-nested-ternary
				price < 8000
					? price / 4
					: price < 50000
					? price / 5
					: (price * 3) / 20;

			setFinddoTax(Math.floor(tax));

			const total = price + Math.floor(tax) + productPrice;

			total === 0 ? setTotal("") : setTotal(total.toString());
		}, [price, productPrice]);

		const handleSubmitBudget = useCallback(async () => {
			setIsLoading(true);
			try {
				await finddoApi.post("/orders/propose_budget", {
					id,
					budget: price,
					material_value: productPrice,
					is_previous: true,
				});

				const response = await finddoApi.get(`/orders/${id}`);

				dispatch(updateService(response.data));
			} catch (error) {
				if (error.message === "Invalid service data")
					Alert.alert("Erro no envio do orçamento, tente novamente");
				else if (error.message === "Connection error")
					Alert.alert("Falha ao conectar");
				else throw error;
				setIsLoading(false);
			} finally {
				setIsLoading(false);
				Alert.alert("Orçamento realizado com sucesso");
				navigation.goBack();
			}
		}, [navigation, price, productPrice, id, dispatch]);

		const updateBudget = (
			data: string,
			updateFunction: (data: number) => void,
		): void => {
			updateFunction(data !== "" ? parseInt(data, 10) : 0);
		};

		if (!id) return <View></View>;

		return (
			<ImageBackground
				style={styles.backgroundImageContent}
				source={require("assets/Ellipse.png")}
			>
				<TaskAwaitIndicator isAwaiting={isLoading} />
				<SvgXml xml={finddoLogo} width={"45%"} height={"10%"} />
				<Layout level="1" style={styles.layout}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<Text style={styles.title}>Cálculo do serviço</Text>
						<View style={styles.viewInput}>
							<ValidatedMaskedInput
								style={styles.input}
								formatter={priceFormatter}
								formattingFilter={numericFormattingFilter}
								onChangeText={input => updateBudget(input, setPrice)}
								keyboardType={"number-pad"}
								value={price !== 0 ? price.toString() : ""}
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
								value={finddoTax !== 0 ? finddoTax.toString() : ""}
								maxLength={11}
							/>
							<Text style={styles.text}>(Finddo)</Text>
						</View>
						<View style={styles.viewInput}>
							<ValidatedMaskedInput
								style={styles.input}
								formatter={priceFormatter}
								formattingFilter={numericFormattingFilter}
								onChangeText={input => {
									updateBudget(input, setProductPrice);
								}}
								keyboardType={"number-pad"}
								value={
									productPrice !== 0 ? productPrice.toString() : ""
								}
								maxLength={11}
							/>
							<Text style={styles.text}>(Produtos)</Text>
						</View>
						<View style={styles.viewTotal}>
							<Text style={styles.textTotal}>
								TOTAL:{"    "}
								<Text style={styles.textPrice}>
									{priceFormatter(total)}
								</Text>
							</Text>
						</View>
						<Button onPress={handleSubmitBudget}>ORÇAR</Button>
					</ScrollView>
				</Layout>
			</ImageBackground>
		);
	}

;

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
		marginTop: "5%",
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
		width: "75%",
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
