import React, {useState, useEffect, useCallback} from "react";
import {
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
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {StackScreenProps} from "@react-navigation/stack";
import {NewServiceStackParams} from "src/routes/app";
import {TouchableWithoutFeedback} from "@ui-kitten/components/devsupport";
import { useDispatch, useSelector } from "react-redux";
import { State } from "stores/index";
import { ProfessionalsState } from "stores/modules/professionals/types";
import finddoApi, { UserApiResponse } from "finddo-api";
import { setProfessionalList } from "stores/modules/professionals/actions";
import { UserState } from "stores/modules/user/types";
import { BACKEND_URL_STORAGE } from "@env";
import { updateNewService } from "stores/modules/services/actions";
import { Service } from "stores/modules/services/types";

type ServiceProfessionalPreferenceScreenProps = StackScreenProps<
	NewServiceStackParams,
	"ServiceProfessionalPreference"
>;

const ServiceProfessionalPreference = ((props: ServiceProfessionalPreferenceScreenProps): JSX.Element => {
	const dispatch = useDispatch();
	const newService = useSelector<State, Service>(state => 
		state.services.newService
	);
	const professionalListStore = useSelector<State, ProfessionalsState>(state => 
		state.professionals
	);

	const [isLoading, setIsLoading] = useState(false);
	const [selected, setSelected] = useState<string>("");
	const [value, setValue] = useState("");

	const fetchProfessionals = useCallback(async (name: string, page = 1): Promise<void> => {
		setIsLoading(true);

		try {
			const response = await finddoApi.post(`/users/find_by_name`, {
				user: {name},
				page,
			});

			const list: UserState[] = response.data.items.map(
				(item:{data:{attributes: UserApiResponse}})=>Object.assign(item.data.attributes, 
					{ profilePicture: item.data.attributes.photo ? {
					uri: `${BACKEND_URL_STORAGE}${item.data.attributes.photo}`,
				}: require("../../../../assets/sem-foto.png")})
			);

			dispatch(setProfessionalList({
				list: page === 1 ? list : professionalListStore.list.concat(list),
				current_page: page,
				total_pages: response.data.total_pages,
			}));
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error)
			if (error.response) throw new Error("Invalid name data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}finally{
			setIsLoading(false);
		}
	}, [dispatch, professionalListStore]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => void fetchProfessionals(value, 1), [value]);

	const handleExpandList = useCallback(()=>{
		try {
			if(professionalListStore.current_page){
				fetchProfessionals(value, professionalListStore.current_page + 1);
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
		}
	}, [professionalListStore, fetchProfessionals, value]);

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

		dispatch(updateNewService({
			...newService, 
			filtered_professional: selected
		}))
		props.navigation.navigate("ServiceCategories");
	}

	return (
		<Layout level="3">
			<View style={styles.container}>
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
			</View>
		</Layout>
	);
});

export default ServiceProfessionalPreference;

const styles = StyleSheet.create({
	container: {width: "100%", height: "100%"},
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
		margin: 16,
	},
});
