/* eslint-disable react-native/no-color-literals */
import React, {useState, useEffect, useCallback} from "react";
import {
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	View,
	Dimensions,
	Alert,
} from "react-native";
import {
	Button,
	Text,
	Layout,
	Icon,
	Input,
	List,
	ListItem,
	Avatar,
	Divider,
} from "@ui-kitten/components";
import { useProfessionalList, useService, useUser} from "hooks";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {StackScreenProps} from "@react-navigation/stack";
import {NewServiceStackParams} from "src/routes/app";
import {TouchableWithoutFeedback} from "@ui-kitten/components/devsupport";

type ServiceProfessionalPreferenceScreenProps = StackScreenProps<
	NewServiceStackParams,
	"ServiceProfessionalPreference"
>;

const ServiceProfessionalPreference = ((props: ServiceProfessionalPreferenceScreenProps): JSX.Element => {
	const userStore = useUser();
	const serviceStore = useService();
	const professionalListStore = useProfessionalList();

	const [isLoading, setIsLoading] = useState(false);
	const [selected, setSelected] = useState("");
	const [value, setValue] = useState("");

	useEffect(() => {
		setIsLoading(true);
		try {
			professionalListStore.fetchProfessionals(value, 1);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
		}
		setIsLoading(false);
	}, [professionalListStore, userStore, value]);

	const handleExpandList = useCallback(()=>{
		try {
			if(professionalListStore.current_page){
				professionalListStore.fetchProfessionals(value, professionalListStore.current_page + 1);
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
		}
	}, [professionalListStore, value]);

	const onChangeText = (query: string): void => {
		setValue(query);
	};

	const clearInput = (): void => {
		setValue("");
	};

	const renderCloseIcon = (props: any): JSX.Element => (
		<TouchableWithoutFeedback onPress={clearInput}>
			<Icon {...props} name="close" />
		</TouchableWithoutFeedback>
	);

	function handleSubmit(): void {
		if(!selected){
			Alert.alert("Nenhum profissional foi selecionado");		
			
			return;
		}

		serviceStore.filtered_professional = selected;
		props.navigation.navigate("ServiceCategories");
	}

	return (
		<Layout level="3">
			<ScrollView>
				<TaskAwaitIndicator isAwaiting={isLoading} />
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : void 0}
					keyboardVerticalOffset={Platform.OS === "ios" ? 200 : void 0}
					style={styles.formWrapper}
				>
					<Text category="h4">Associar um profissional</Text>
					<View style={styles.searchContainer}>
						<Input
							placeholder="Digite o nome do profissional"
							value={value}
							onChangeText={onChangeText}
							accessoryRight={renderCloseIcon}
							style={styles.searchProfessional}
						/>
					</View>
				</KeyboardAvoidingView>

				<List
					scrollEnabled
					ItemSeparatorComponent={Divider}
					onEndReached={handleExpandList}
					onEndReachedThreshold={0.2}
					style={styles.listContainer}
					data={professionalListStore.list}
					renderItem={({ item, index }) => (
						<ListItem
							key={index}
							style={item.id === selected ? styles.listItemSelected : styles.listItem}
							onPress={()=>setSelected(item.id)}
							title={()=><Text style={styles.title}>{item.name}</Text>}
							description={()=><Text style={styles.description}>Classificação: {item.rate} estrelas</Text>}
							accessoryLeft={(props) => (
								<Avatar {...props} style={styles.avatar} source={item.profilePicture} />
							)}
						/>
					)}
    		/>
		
				<Button style={styles.button} onPress={handleSubmit}>CONTINUAR</Button>
			</ScrollView>
		</Layout>
	);
});

export default ServiceProfessionalPreference;

const styles = StyleSheet.create({
	// backgroundImageContent: {width: "100%", height: "100%"},
	formWrapper: {
		flex: 1,
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
	},
	listContainer: {
		alignSelf: "center",
		width:"90%",
		maxHeight: Math.round(Dimensions.get('window').height)*0.5,
	},
	searchContainer: {
		alignItems: "center",
		justifyContent: "flex-start",
		flexDirection: "row",
		margin: 16,
	},
	listItem: {
		height: 80,
		margin: 4,
		borderRadius: 8,
	},
	listItemSelected: {
		height: 80,
		margin: 4,
		borderRadius: 8,
		borderColor: "green",
		borderWidth: 1,
	},
	title: {
		fontSize: 20,
		fontWeight: "500",
	},
	description: {
		fontSize: 14,
		fontWeight: "300",
		color: "#666",
	},
	avatar: {
		width: 56,
		height: 56,
		marginRight: 12,
	},
	searchProfessional: {
		height: 26,
		alignSelf: "center",
		width: "95%",
		margin: 12,
	},
	button: {
		width: "90%", 
		borderRadius: 8,
		alignSelf: "center",
	},
});
