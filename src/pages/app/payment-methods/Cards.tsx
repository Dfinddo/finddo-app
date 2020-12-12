import React, {useState, FC, useEffect, useCallback} from "react";
import {View, ListRenderItemInfo, Alert, RefreshControl} from "react-native";
import {
	List,
	Button,
	Icon,
	useStyleSheet,
	StyleService,
	Text,
	Layout,
	useTheme,
} from "@ui-kitten/components";
import {StackScreenProps} from "@react-navigation/stack";
import {PaymentMethodsStackParams} from "src/routes/app";
import { useDispatch, useSelector } from "react-redux";
import {State} from "stores/index";
import { Card } from "stores/modules/cards/types";
import { removeCard, setCardsList } from "stores/modules/cards/actions";
import finddoApi, { CardApiResponse } from "finddo-api";
import { AxiosResponse } from "axios";

interface ICreditCard {
	id: string;
	brand: string;
	first6: string;
	last4: string;
	store: boolean;
}

type CardsScreenProps = StackScreenProps<PaymentMethodsStackParams, "Cards">;

const CreditCardList: FC<CardsScreenProps> = ({navigation}) => {
	const styles = useStyleSheet(themedStyles);
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
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

	const handleDeleteCard = useCallback(
		(id: string): void => {
			if (cardListStore.length === 1) {
				Alert.alert(
					"Finddo",
					"Você não pode ter menos de 1 cartão cadastrado.",
					[
						{
							text: "OK",
						},
					],
				);

				return;
			}

			try {
				Alert.alert(
					"Finddo",
					"O cartão selecionado não poderá ser recadastrado nessa conta novamente. Deseja mesmo remover?",
					[
						{text: "Não"},
						{
							text: "Sim",
							onPress: () => {
								finddoApi.delete(`/users/credit_card/${id}`);
								dispatch(removeCard(id));
							},
						},
					],
				);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.log({error});
				Alert.alert("Erro ao tentar remover o Cartão, tente novamente.");
			}
		},
		[cardListStore, dispatch],
	);

	const renderCardItem = (
		info: ListRenderItemInfo<ICreditCard>,
	): JSX.Element => (
		<View style={styles.cardItem}>
			<Text category="h6" status="control">
				{info.item.brand}
				{"   "}
			</Text>
			<Text category="h6" status="control">
				**** **** **** {info.item.last4}
			</Text>
			<Button
				onPress={() => {
					handleDeleteCard(info.item.id);
				}}
				size="medium"
				appearance="ghost"
				status="danger"
				accessoryRight={props => <Icon {...props} name="close" />}
			/>
		</View>
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
			{/* <Button
				style={styles.button}
				onPress={() => navigation.navigate("AddCard")}
			>
				ADICIONAR CARTÃO
			</Button> */}
		</Layout>
	);
};

export default CreditCardList;

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
});
