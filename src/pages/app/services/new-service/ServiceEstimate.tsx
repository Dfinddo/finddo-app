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
							Quer receber um orçamento prévio ou prefere que o
							profissional faça presencialmente?
						</Text>
						<RadioGroup
							selectedIndex={isPrevious}
							onChange={index => setIsPrevious(index)}
							style={styles.radioGroup}
						>
							<Radio>
								{evaProps => (
									<Text {...evaProps} style={styles.radio}>
										Orçamento prévio
									</Text>
								)}
							</Radio>
							<Radio>
								{evaProps => (
									<Text {...evaProps} style={styles.radio}>
										Orçamento presencial
									</Text>
								)}
							</Radio>
						</RadioGroup>

						{isPrevious === 0 && (
							<View style={styles.estimateContainer}>
								<Text style={styles.text}>
									Você já recebeu um orçamento? Nos informe o valor.
								</Text>
								<ValidatedInput
									style={styles.input}
									placeholder="(opcional)"
								/>
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
	title: {fontSize: 18, width: "90%", textAlign: "center"},
	text: {fontSize: 16, width: "90%"},
	input: {marginTop: 8},
	radioGroup: {
		width: "90%",
		alignItems: "flex-start",
		flexDirection: "column",
		justifyContent: "space-around",
		paddingVertical: 8,
		paddingHorizontal: "15%",
	},
	radio: {fontSize: 18, marginLeft: 8},
	estimateContainer: {
		flex: 1,
		width: "100%",
		marginTop: "0.8%",
		paddingHorizontal: "5%",
	},
});
