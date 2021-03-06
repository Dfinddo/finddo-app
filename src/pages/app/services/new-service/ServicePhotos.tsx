import React, {useState} from "react";
import {
	View,
	Pressable,
	Image,
	Alert,
	StyleSheet,
	useWindowDimensions,
} from "react-native";
import {Button, Text, Layout, useTheme} from "@ui-kitten/components";
import {useService} from "hooks";
import {serviceCategories} from "finddo-api";
import {observer} from "mobx-react-lite";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {StackScreenProps} from "@react-navigation/stack";
import {NewServiceStackParams} from "src/routes/app";
import ImagePicker from "react-native-image-crop-picker";
import Carousel from "react-native-snap-carousel";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type ServicePhotosScreenProps = StackScreenProps<
	NewServiceStackParams,
	"ServicePhotos"
>;

const ServiceFotos = observer<ServicePhotosScreenProps>(props => {
	const [isLoading, setIsLoading] = useState(false);
	const windowWidth = useWindowDimensions().width;
	const serviceStore = useService();
	const selectedCategory = serviceCategories[serviceStore.categoryID!];

	const removePhoto = (index: number) => (): void =>
		Alert.alert("Foto", "Deseja remove essa foto?", [
			{text: "Cancelar"},
			{
				text: "Remover foto",
				onPress: () => serviceStore.images.splice(index, 1),
			},
		]);

	const onAdvance = () => void props.navigation.navigate("ServiceAddress");

	const servicePhotos = serviceStore.images.map((image, i) => (
		<Pressable key={image.path} onPress={removePhoto(i)}>
			<Image
				style={styles.serviceImage}
				source={{uri: `data:${image.mime};base64,${image.data}`}}
			/>
		</Pressable>
	));

	return (
		<Layout level="2" style={styles.container}>
			<TaskAwaitIndicator isAwaiting={isLoading} />
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
			<Button onPress={onAdvance}>CONTINUAR</Button>
		</Layout>
	);
});

const AddPhotoButton = observer(() => {
	const theme = useTheme();
	const serviceStore = useService();

	const addPhoto = (): void =>
		Alert.alert("Foto", "O que deseja fazer?", [
			{text: "Cancelar"},
			{
				text: "Tirar uma nova foto",
				onPress: () =>
					ImagePicker.openCamera({includeBase64: true}).then(image => {
						serviceStore.images = serviceStore.images.concat(image);
					}),
			},
			{
				text: "Adicionar foto da galeria",
				onPress: () =>
					ImagePicker.openPicker({
						includeBase64: true,
						multiple: true,
					}).then(image => {
						serviceStore.images = serviceStore.images.concat(image);
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
});

export default ServiceFotos;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 10,
		alignItems: "center",
	},
	categoryImage: {width: "100%"},
	descriptionText: {
		fontSize: 18,
		textAlign: "center",
		marginTop: 10,
	},
	serviceImagesContainer: {
		width: "100%",
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
		marginTop: 30,
		flexWrap: "wrap",
	},
	serviceImage: {
		height: 200,
		width: "100%",
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
	},
});
