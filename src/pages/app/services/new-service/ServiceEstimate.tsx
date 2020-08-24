import React, {useState} from "react";
import {
	View,
	Image,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
} from "react-native";
import {Text, Button, Layout, RadioGroup, Radio} from "@ui-kitten/components";
import {useService} from "hooks";
import {observer} from "mobx-react-lite";
import {serviceCategories} from "finddo-api";
import {StackScreenProps} from "@react-navigation/stack";
import {NewServiceStackParams} from "src/routes/app";
import ValidatedInput from "components/ValidatedInput";

type ServiceEstimateScreenProps = StackScreenProps<
	NewServiceStackParams,
	"ServiceEstimate"
>;

const NewService = observer<ServiceEstimateScreenProps>(props => {
	const serviceStore = useService();
	const selectedCategory = serviceCategories[serviceStore.categoryID!];
	const [isPrevious, setIsPrevious] = useState(1);

	const onAdvanceAttempt = (): void => {
		props.navigation.navigate("ServiceDate");
	};

	return (
		<Layout style={styles.background}>
			<ScrollView>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
				>
					<Image
						style={styles.categoryImage}
						source={selectedCategory.imageUrl}
					/>
					<View style={styles.contentWrapper}>
						<Text style={styles.title}>
							Deseja fazer orçamento prévio?
						</Text>
						<RadioGroup
							selectedIndex={isPrevious}
							onChange={index => setIsPrevious(index)}
							style={styles.radioGroup}
						>
							<Radio>
								{evaProps => (
									<Text {...evaProps} style={styles.radio}>
										Sim
									</Text>
								)}
							</Radio>
							<Radio>
								{evaProps => (
									<Text {...evaProps} style={styles.radio}>
										Não
									</Text>
								)}
							</Radio>
						</RadioGroup>

						{isPrevious === 0 && (
							<View style={styles.estimateContainer}>
								<Text style={styles.text}>
									Já possui um orçamento? Nos informe o valor.
								</Text>
								<ValidatedInput placeholder="(opcional)" />
							</View>
						)}
					</View>
				</KeyboardAvoidingView>
			</ScrollView>
			<View style={styles.continueButtonContainer}>
				<Button onPress={onAdvanceAttempt}>CONTINUAR</Button>
			</View>
		</Layout>
	);
});

export default NewService;

const styles = StyleSheet.create({
	background: {width: "100%", height: "100%"},
	categoryImage: {width: "100%"},
	contentWrapper: {
		width: "100%",
		paddingHorizontal: 10,
		marginTop: 48,
		alignItems: "center",
	},
	continueButtonContainer: {
		marginVertical: 10,
		width: "100%",
		height: 45,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {fontSize: 24, width: "90%", textAlign: "center"},
	text: {fontSize: 18, width: "90%", textAlign: "center"},
	radioGroup: {
		width: "90%",
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-around",
		paddingVertical: 16,
		paddingHorizontal: "15%",
	},
	radio: {fontSize: 20, marginLeft: 8},
	estimateContainer: {
		flex: 1,
		width: "100%",
		marginTop: 32,
		paddingHorizontal: 12,
	},
});
