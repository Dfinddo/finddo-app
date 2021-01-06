import React, {useState, FC, useEffect, useCallback} from "react";
import {View, ListRenderItemInfo, Alert, RefreshControl, TouchableOpacity} from "react-native";
import {
	List,
	Button,
	Icon,
	useStyleSheet,
	StyleService,
	Text,
	Layout,
	useTheme,
	Modal,
} from "@ui-kitten/components";
import {StackScreenProps} from "@react-navigation/stack";
import {PaymentMethodsStackParams} from "src/routes/app";
import { useDispatch, useSelector } from "react-redux";
import {State} from "stores/index";
import { Card } from "stores/modules/cards/types";
import { setCardsList } from "stores/modules/cards/actions";
import finddoApi, { CardApiResponse } from "finddo-api";
import { AxiosResponse } from "axios";
import { Service } from "stores/modules/services/types";
import { priceFormatter } from "utils";
import ValidatedInput from "components/ValidatedInput";

interface ICreditCard {
	id: string;
	brand: string;
	first6: string;
	last4: string;
	store: boolean;
}

type CardsScreenProps = StackScreenProps<PaymentMethodsStackParams, "PaymentWithCard">;

const PaymentWithCard: FC<CardsScreenProps> = ({navigation, route}) => {
	const {order_id} = route.params;
	const styles = useStyleSheet(themedStyles);

	const [isLoading, setIsLoading] = useState(false);
	const [isPayment, setIsPayment] = useState(false);
	const [selectedCard, setSelectedCard] = useState("");
	const [cvc, setCvc] = useState("");

	const dispatch = useDispatch();
	const serviceStore = useSelector<State, Service | undefined>(state => 
		state.services.list.items.find(item => item.id === Number(order_id))
	);
	const cardListStore = useSelector<State, Card[]>(state => 
		state.cards.list
	);
	const theme = useTheme();

	const getCreditCards = useCallback(async (): Promise<void> => {
		setIsLoading(true);

		try {
			const response: AxiosResponse<CardApiResponse[]> = await finddoApi.get(`/users/get_credit_card`);
			const cards: Card[] = response.data.map(item => item.creditCard);

			dispatch(setCardsList(cards));
		} catch (error) {
			if (error.response) {
				Alert.alert("Erro", "Verifique sua conexão e tente novamente");
			} else if (error.request) {
				Alert.alert(
					"Falha ao se conectar",
					"Verifique sua conexão e tente novamente",
				);
			} else throw error;
		} finally {
			setIsLoading(false);
		}
	}, [dispatch]);

	useEffect(() => {
		getCreditCards();
	}, [getCreditCards]);

	const handleSelectPayment = (id: string): void => {
		setSelectedCard(id);
		setIsPayment(true);
	};

	const handlePayment = useCallback(async()=>{
		try {
			await finddoApi.post(`/orders/create_payment/${order_id}`, {
				payment_data: {
						installmentCount: 1,
						statementDescriptor: "Finddo",
						fundingInstrument: {
								method: "CREDIT_CARD",
								creditCard: {
									id: selectedCard,
									cvc,
								}
						}
				}
			});

			Alert.alert("Finddo", "Pagamento realizado com sucesso");
			navigation.navigate("ServiceClosure", {id: Number(order_id)});
		} catch (_error) {
			Alert.alert("Finddo", "Erro ao tentar realizar o pagamento. Tente novamente");
		}
	}, [cvc, selectedCard , order_id, navigation]);

	const renderCardItem = (
		info: ListRenderItemInfo<ICreditCard>,
	): JSX.Element => (
		<TouchableOpacity 
			style={styles.cardItem}
			onPress={() => handleSelectPayment(info.item.id)}
		>
			<Text category="h6" status="control">
				{info.item.brand}
				{"   "}
			</Text>
			<Text category="h6" status="control">
				**** **** **** {info.item.last4}
			</Text>
		</TouchableOpacity>
	);

	return (
		<Layout level="2" style={styles.container}>
			<List
				style={styles.list}
				contentContainerStyle={styles.listContent}
				data={cardListStore}
				refreshControl={
					<RefreshControl
						colors={[theme["color-primary-active"]]}
						refreshing={isLoading}
						onRefresh={getCreditCards}
					/>
				}
				renderItem={renderCardItem}
			/>
			<Button
				style={styles.button}
				onPress={() => navigation.navigate("NewCardPayment", {order_id})}
			>
				USAR OUTRO MÉTODO DE PAGAMENTO
			</Button>

			{serviceStore && serviceStore.budget && <Modal
				visible={isPayment}
				backdropStyle={styles.backdrop}
				style={styles.modalContainer}
				onBackdropPress={() => setIsPayment(false)}
			>
				<Layout level="2" style={styles.modalContent}>
					<Text>Cálculo do serviço</Text>
					<View style={styles.viewText}>
						<Text style={styles.textPrice}>
							{priceFormatter(
								serviceStore.budget.budget.toString(),
							)}
						</Text>
						<Text style={styles.text}>(Serviço)</Text>
					</View>
					<View style={styles.viewText}>
						<Text style={styles.textPrice}>
							{priceFormatter(
								(
									serviceStore.budget.value_with_tax -
									serviceStore.budget.budget
								).toString(),
							)}
						</Text>
						<Text style={styles.text}>(Finddo)</Text>
					</View>
					<View style={styles.viewText}>
						<Text style={styles.textPrice}>
							{priceFormatter(
								serviceStore.budget.material_value.toString(),
							)}
						</Text>
						<Text style={styles.text}>(Produtos)</Text>
					</View>
					<View style={styles.viewTotal}>
						<Text style={styles.textTotal}>
							TOTAL:{"     "}
							<Text style={styles.textPrice}>
								{priceFormatter(
									(
										serviceStore.budget.value_with_tax +
										serviceStore.budget.material_value
									).toString(),
								)}
							</Text>
						</Text>
					</View>
						<ValidatedInput
							onChangeText={input => setCvc(input)}
							label="Digite o cvc do cartão."
							value={cvc}
							maxLength={3}
						/>
					<Button onPress={handlePayment}>
						Pagar
					</Button>
					<Button status="danger" onPress={() => setIsPayment(false)}>
						Cancelar
					</Button>
				</Layout>
			</Modal>}
		</Layout>
	);
};

export default PaymentWithCard;

const themedStyles = StyleService.create({
	container: {
		flex: 1,
	},
	list: {
		flex: 1,
	},
	listContent: {
		padding: 16,
	},
	cardItem: {
		margin: 8,
		padding: 24,
		borderRadius: 8,
		backgroundColor: "color-info-500",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	button: {
		margin: 16,
	},
	// modal
	modalContainer: {
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "center",
		height: "56%",
		width: "60%",
	},
	modalContent: {
		flex: 1,
		padding: "6%",
		marginBottom: "5%",
		borderRadius: 8,
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
	viewText: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		marginTop: 16,
	},
	text: {
		color: "color-primary-default",
		fontSize: 16,
		marginTop: 8,
	},
	viewTotal: {
		width: "100%",
		alignSelf: "center",
		padding: 16,
		marginBottom: 16,
	},
	backdrop: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
});
