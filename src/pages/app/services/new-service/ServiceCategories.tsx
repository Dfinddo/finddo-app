import React from "react";
import {
	Image,
	ImageBackground,
	Pressable,
	View,
	StyleSheet,
} from "react-native";
import {List, Card, Text} from "@ui-kitten/components";
import {useService} from "hooks";
import {serviceCategories} from "finddo-api";
import {observer} from "mobx-react-lite";
import {StackScreenProps} from "@react-navigation/stack";
import {NewServiceStackParams} from "src/routes/app";

type ServiceCategoriesScreenProps = StackScreenProps<
	NewServiceStackParams,
	"ServiceCategories"
>;

const categoryList = Object.entries(
	serviceCategories,
).map(([id, categoryData]) => ({id, ...categoryData}));

const Services = observer<ServiceCategoriesScreenProps>(({navigation}) => {
	const serviceStore = useService();

	return (
		<ImageBackground
			style={styles.backgroundImageContent}
			source={require("assets/Ellipse.png")}
		>
			<View>
				<List
					contentContainerStyle={styles.contentContainer}
					data={categoryList}
					keyExtractor={item => item.id}
					renderItem={({item, index}) => (
						<Card
							key={index}
							style={styles.item}
							header={headerProps => (
								<Text {...headerProps} category="h5">
									{item.name}
								</Text>
							)}
						>
							<Pressable
								onPress={() => {
									serviceStore.categoryID = item.id;
									navigation.navigate("ServiceDescription");
								}}
							>
								<Image style={styles.image} source={item.imageUrl} />
							</Pressable>
						</Card>
					)}
				/>
			</View>
		</ImageBackground>
	);
});

export default Services;

const styles = StyleSheet.create({
	contentContainer: {
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	image: {
		marginTop: 3,
		borderRadius: 10,
		width: "100%",
		height: 180,
	},
	item: {
		marginVertical: 4,
	},
	backgroundImageContent: {
		width: "100%",
		height: "100%",
	},
});
