import React, {useState} from "react";
import {
	ScrollView,
	StyleSheet,
	Image,
	Pressable,
	useWindowDimensions,
	ImageSourcePropType,
} from "react-native";
import {serviceCategories, serviceStatusDescription} from "finddo-api";
import {Layout, Text} from "@ui-kitten/components";
import DataPieceDisplay from "components/DataPieceDisplay";
import ImageView from "react-native-image-viewing";
import Carousel from "react-native-snap-carousel";
import {BACKEND_URL_STORAGE} from "@env";
import {format} from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import {priceFormatter} from "utils";
import { Service } from "stores/modules/services/types";

interface ServiceImageRenderer {
	(image: {item: ImageSourcePropType; index: number}): JSX.Element;
}

const ServiceDataDisplay = ((props: {serviceStore: Service}): JSX.Element => {
	const {serviceStore} = props;
	const windowWidth = useWindowDimensions().width;
	const [displayedImage, setDisplayedImage] = useState<number | null>(null);

	const images = serviceStore.images.map(image => {
		if (image.mime) {
			return {
				uri: `data:${image.mime};base64,${image.data}`,
			};
		}

		return {uri: BACKEND_URL_STORAGE + image};
	});

	const renderServiceImage: ServiceImageRenderer = ({item, index}) => (
		<Pressable onPress={() => setDisplayedImage(index)}>
			<Image style={styles.serviceImage} source={item} />
		</Pressable>
	);

	return (
		<Layout level="2" style={styles.container}>
			<ScrollView>
				{
					// console.log(images) ||
					serviceStore.images.length > 0 && (
						<>
							<ImageView
								images={images}
								imageIndex={displayedImage ?? 0}
								visible={displayedImage !== null}
								onRequestClose={() => setDisplayedImage(null)}
							/>
							<Carousel
								containerCustomStyle={styles.blockStart}
								data={images}
								renderItem={renderServiceImage}
								sliderWidth={windowWidth}
								itemWidth={(windowWidth * 3) / 4}
							/>
						</>
					)
				}

				<Layout level="1">
					<Text style={styles.descriptionWrapper} appearance="hint">Descrição</Text>
					<Text 
						style={styles.description} 
						// appearance="hint"
					>
						{serviceStore.description}
					</Text>
				</Layout>
				<DataPieceDisplay
					style={styles.blockStart}
					hint="Categoria"
					value={serviceCategories[serviceStore.category.id!].name}
				/>
				{serviceStore.previous_budget_value && (
					<DataPieceDisplay
						hint="Valor estimado pelo cliente"
						value={priceFormatter(
							serviceStore.previous_budget_value.toString(),
						)}
					/>
				)}
				{/* {Boolean(serviceStore.order_status) && (
					<DataPieceDisplay
						hint="Status"
						value={serviceStatusDescription[serviceStore.order_status]}
					/>
				)} */}
				<DataPieceDisplay
					hint="Data"
					value={`${format(
						serviceStore.serviceDate,
						"EEEE', dia' dd 'de' MMMM 'de' yyyy",
						{locale: ptBR},
					)},\nentre ${serviceStore.hora_inicio} e ${serviceStore.hora_fim}`}
				/>
				<DataPieceDisplay
					style={styles.blockStart}
					hint="Rua"
					value={serviceStore.address.street}
				/>
				<DataPieceDisplay
					hint="Número"
					value={serviceStore.address.number}
				/>
				<DataPieceDisplay
					hint="Complemento"
					value={serviceStore.address.complement}
				/>
				<DataPieceDisplay
					hint="CEP"
					value={serviceStore.address.cep.replace(
						/([0-9]{5})([0-9])/,
						"$1-$2",
					)}
				/>
			</ScrollView>
		</Layout>
	);
});

export default ServiceDataDisplay;

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
	},
	description: {
		padding: 24,
	},
	descriptionWrapper: {
		marginTop: 24, 
		marginLeft:24, 
		marginBottom: 12,
		alignItems:"center",
		textAlign:"center",
	},
	blockStart: {marginTop: 24},
	serviceImage: {height: 200, width: "100%"},
});
