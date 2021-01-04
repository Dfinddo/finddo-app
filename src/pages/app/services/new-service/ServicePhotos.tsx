import React from "react";
import {
	View,
	Pressable,
	Image,
	Alert,
	StyleSheet,
	useWindowDimensions,
	ScrollView,
} from "react-native";
import {Button, Text, Layout, useTheme} from "@ui-kitten/components";
import {serviceCategories} from "finddo-api";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {StackScreenProps} from "@react-navigation/stack";
import {NewServiceStackParams} from "src/routes/app";
import ImagePicker from "react-native-image-crop-picker";
import Carousel from "react-native-snap-carousel";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { State } from "stores/index";
import { Service } from "stores/modules/services/types";
import { updateNewService } from "stores/modules/services/actions";

type ServicePhotosScreenProps = StackScreenProps<
	NewServiceStackParams,
	"ServicePhotos"
>;

interface ImageProps {
	data: string;
	mime: string;
}

const ServiceFotos = ((props :ServicePhotosScreenProps): JSX.Element => {
	// const [isLoading, setIsLoading] = useState(false);
	const windowWidth = useWindowDimensions().width;
	const dispatch = useDispatch();
	const newService = useSelector<State, Service>(state => 
		state.services.newService
	);
	const selectedCategory = serviceCategories[newService.category.id!];

	const removePhoto = (index: number) => (): void =>
		Alert.alert("Foto", "Deseja remove essa foto?", [
			{text: "Cancelar"},
			{
				text: "Remover foto",
				onPress: () => dispatch(updateNewService({
					...newService,
					images: newService.images.splice(index, 1),
				})),
			},
		]);

	const onAdvance = () => void props.navigation.navigate("ServiceAddress");

	const servicePhotos = newService.images.map((image, i) => (
		<Pressable key={image.data} onPress={removePhoto(i)}>
			<Image
				style={styles.serviceImage}
				source={{uri: `data:${image.mime};base64,${image.data}`}}
			/>
		</Pressable>
	));

	return (
		<ScrollView>
		<Layout level="2" style={styles.container}>
			{/* <TaskAwaitIndicator isAwaiting={isLoading} /> */}
			<Image
				source={selectedCategory.imageUrl}
				style={styles.categoryImage}
			/>
			<Text style={styles.descriptionText}>
				Nos ajude com fotos do problema (opcional)
			</Text>
			<View style={styles.serviceImagesContainer}>
				<Carousel
					// containerCustomStyle={styles.blockStart}
					data={[...servicePhotos, <AddPhotoButton key="addPhoto" />]}
					renderItem={({item}: {item: JSX.Element}) => item}
					sliderWidth={windowWidth}
					itemWidth={(windowWidth * 3) / 4}
				/>
			</View>
			<Button style={styles.buttom} onPress={onAdvance}>
				CONTINUAR
			</Button>
		</Layout>
		</ScrollView>
	);
});

const AddPhotoButton = (): JSX.Element => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const newService = useSelector<State, Service>(state => 
		state.services.newService
	);

	const addPhoto = (): void =>
		Alert.alert("Foto", "O que deseja fazer?", [
			{text: "Cancelar"},
			{
				text: "Tirar uma nova foto",
				onPress: () =>
					ImagePicker.openCamera({includeBase64: true}).then(image => {
						dispatch(updateNewService({
							...newService,
							images: newService.images.concat(
								image as ImageProps,
							),
						}));
					}),
			},
			{
				text: "Adicionar foto da galeria",
				onPress: () =>
					ImagePicker.openPicker({
						includeBase64: true,
						multiple: true,
					}).then((image: unknown) => {
						dispatch(updateNewService({
							...newService,
							images: newService.images.concat(
								image as ImageProps,
							),
						}));
					}),
			},
		]);

	return (
		<Pressable onPress={addPhoto}>
			<Layout style={styles.serviceImage} level="1">
				<Icon
					name="camera-plus"
					size={60}
					color={theme["color-primary-default"]}
				/>
			</Layout>
		</Pressable>
	);
};

export default ServiceFotos;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 24,
		alignItems: "center",
		justifyContent: "space-between",
	},
	categoryImage: {width: "100%", maxHeight: "35%"},
	descriptionText: {
		fontSize: 18,
		textAlign: "center",
		marginTop: 10,
	},
	serviceImagesContainer: {
		width: "100%",
		height: "50%",
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
		marginTop: 10,
		flexWrap: "wrap",
	},
	serviceImage: {
		height: 200,
		width: "100%",
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
	},
	buttom: {
		marginTop: 0.8,
		width: "90%",
		height: 24,
	},
});
