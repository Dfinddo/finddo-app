import React from "react";
import {
	Image,
	ImageBackground,
	Pressable,
	View,
	StyleSheet,
} from "react-native";
import {List, Card, Text} from "@ui-kitten/components";
import {serviceCategories} from "finddo-api";
import {StackScreenProps} from "@react-navigation/stack";
import {NewServiceStackParams} from "src/routes/app";
import { useDispatch, useSelector } from "react-redux";
import { State } from "stores/index";
import { Service } from "stores/modules/services/types";
import { updateNewService } from "stores/modules/services/actions";

type ServiceCategoriesScreenProps = StackScreenProps<
	NewServiceStackParams,
	"ServiceCategories"
>;

const categoryList = Object.entries(
	serviceCategories,
).map(([id, categoryData]) => ({id, ...categoryData}));

const Services = (({navigation}: ServiceCategoriesScreenProps): JSX.Element => {
	const dispatch = useDispatch();
	const newService = useSelector<State, Service>(state =>
		state.services.newService
	);

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
									dispatch(updateNewService({
										...newService,
										category: {
											id: item.id,
											name: item.name,
										},
									}));
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
