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
import {useCardList} from "hooks";

interface ICreditCard {
	creditCard: {
		id: string;
		brand: string;
		first6: string;
		last4: string;
		store: boolean;
	};
}

type CardsScreenProps = StackScreenProps<PaymentMethodsStackParams, "Cards">;

const CreditCardList: FC<CardsScreenProps> = ({navigation}) => {
	const styles = useStyleSheet(themedStyles);
	const [isLoading, setIsLoading] = useState(false);
	const cardListStore = useCardList();
	const theme = useTheme();

	const getCreditCards = useCallback(async (): Promise<void> => {
		setIsLoading(true);

		try {
			await cardListStore.fetchCards();
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
	}, [cardListStore]);

	useEffect(() => {
		getCreditCards();
	}, [getCreditCards]);

	const handleDeleteCard = useCallback(
		(id: string): void => {
			if (cardListStore.list.length === 1) {
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
							onPress: () => cardListStore.removeCard(id),
						},
					],
				);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.log({error});
				Alert.alert("Erro ao tentar remover o Cartão, tente novamente.");
			}
		},
		[cardListStore],
	);

	const renderCardItem = (
		info: ListRenderItemInfo<ICreditCard>,
	): JSX.Element => (
		<View style={styles.cardItem}>
			<Text category="h6" status="control">
				{info.item.creditCard.brand}
				{"   "}
			</Text>
			<Text category="h6" status="control">
				**** **** **** {info.item.creditCard.last4}
			</Text>
			<Button
				onPress={() => {
					handleDeleteCard(info.item.creditCard.id);
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
				data={cardListStore.list}
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
