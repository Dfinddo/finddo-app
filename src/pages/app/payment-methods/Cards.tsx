import React, {useState, FC, useEffect} from "react";
import {View, ActivityIndicator, Image, ListRenderItemInfo} from "react-native";
import {
	List,
	Button,
	Modal,
	useStyleSheet,
	StyleService,
	Text,
	Layout,
} from "@ui-kitten/components";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
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

	useEffect(() => {
		setIsLoading(true);
		try {
			cardListStore.fetchCards();
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
		}
		setIsLoading(false);
	}, [cardListStore]);

	const renderCardItem = (
		info: ListRenderItemInfo<ICreditCard>,
	): JSX.Element => (
		<View style={styles.cardItem}>
			<Text category="h5" status="control">
				{info.item.creditCard.brand}
			</Text>
			<Text category="h6" status="control">
				**** **** **** {info.item.creditCard.last4}
			</Text>
		</View>
	);

	return (
		<Layout level="2" style={styles.container}>
			<TaskAwaitIndicator isAwaiting={isLoading} />
			<List
				style={styles.list}
				contentContainerStyle={styles.listContent}
				data={cardListStore.list}
				renderItem={renderCardItem}
			/>
			<Button onPress={() => navigation.navigate("AddCard")}>
				ADICIONAR CARTÃO
			</Button>
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
		borderRadius: 4,
		backgroundColor: "color-primary-default",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
});
