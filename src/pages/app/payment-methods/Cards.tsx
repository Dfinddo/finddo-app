import React, {useState, FC} from "react";
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

const creditCard = {
	id: "CRC-7YWS1UJRTMYW",
	brand: "VISA",
	first6: "401200",
	last4: "1112",
	store: true,
};

type CardsScreenProps = StackScreenProps<PaymentMethodsStackParams, "Cards">;

const CreditCardList: FC<CardsScreenProps> = ({navigation}) => {
	const styles = useStyleSheet(themedStyles);
	const [isLoading, setIsLoading] = useState(false);
	const [cards, setCards] = useState<typeof creditCard[]>([creditCard]);

	const renderCardItem = (
		info: ListRenderItemInfo<typeof creditCard>,
	): JSX.Element => (
		<View style={styles.cardItem}>
			<Text category="h5" status="control">
				{info.item.brand}
			</Text>
			<Text category="h6" status="control">
				**** **** **** {info.item.last4}
			</Text>
		</View>
	);

	return (
		<Layout level="2" style={styles.container}>
			<TaskAwaitIndicator isAwaiting={isLoading} />
			<List
				style={styles.list}
				contentContainerStyle={styles.listContent}
				data={cards}
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
