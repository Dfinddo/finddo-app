/* eslint-disable react-native/no-color-literals */
import React, {useState, useEffect} from "react";
import {
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	View,
	Dimensions,
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
} from "@ui-kitten/components";
import { useProfessionalList, useUser} from "hooks";
import {observer} from "mobx-react-lite";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {StackScreenProps} from "@react-navigation/stack";
import {NewServiceStackParams} from "src/routes/app";
import {TouchableWithoutFeedback} from "@ui-kitten/components/devsupport";
import UserStore from "stores/user-store";

type ServiceProfessionalPreferenceScreenProps = StackScreenProps<
	NewServiceStackParams,
	"ServiceProfessionalPreference"
>;

// TODO: clean up
const mock = [
	{
		id: "1",
		name: "teste",
		rate: 4.8,
		imageUrl: {uri: "https://image.freepik.com/vetores-gratis/perfil-de-avatar-de-homem-no-icone-redondo_24640-14044.jpg"}
	},
	{
		id: "2",
		name: "teste",
		rate: 4.8,
		imageUrl: {uri: "https://image.freepik.com/vetores-gratis/perfil-de-avatar-de-homem-no-icone-redondo_24640-14044.jpg"}
	},
	{
		id: "3",
		name: "teste",
		rate: 4.8,
		imageUrl: {uri: "https://image.freepik.com/vetores-gratis/perfil-de-avatar-de-homem-no-icone-redondo_24640-14044.jpg"}
	},
	{
		id: "4",
		name: "teste",
		rate: 4.8,
		imageUrl: {uri: "https://image.freepik.com/vetores-gratis/perfil-de-avatar-de-homem-no-icone-redondo_24640-14044.jpg"}
	},
	{
		id: "5",
		name: "teste",
		rate: 4.8,
		imageUrl: {uri: "https://image.freepik.com/vetores-gratis/perfil-de-avatar-de-homem-no-icone-redondo_24640-14044.jpg"}
	},
	{
		id: "6",
		name: "teste",
		rate: 4.8,
		imageUrl: {uri: "https://image.freepik.com/vetores-gratis/perfil-de-avatar-de-homem-no-icone-redondo_24640-14044.jpg"}
	},
	{
		id: "7",
		name: "teste",
		rate: 4.8,
		imageUrl: {uri: "https://image.freepik.com/vetores-gratis/perfil-de-avatar-de-homem-no-icone-redondo_24640-14044.jpg"}
	},
];

const ServiceProfessionalPreference = observer<ServiceProfessionalPreferenceScreenProps>(props => {
	const userStore = useUser();
	const professionalListStore = useProfessionalList();

	const [isLoading, setIsLoading] = useState(false);
	const [selected, setSelected] = useState("");
	const [data, setData] = React.useState<UserStore[]>([]);
	const [value, setValue] = useState<string | undefined>();

	useEffect(() => {
		setIsLoading(true);
		try {
			professionalListStore.fetchProfessionals("pro", 1).then(() => {
				setData(professionalListStore.list);
				console.log(professionalListStore.list);
			});
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
		}
		setIsLoading(false);
	}, [professionalListStore, userStore]);

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
					style={styles.listContainer}
					data={mock} // TODO: trocar para data
					renderItem={({ item, index }) => (
						<ListItem
							key={index}
							style={item.id === selected ? styles.listItemSelected : styles.listItem}
							onPress={()=>setSelected(item.id)}
							
							title={()=><Text style={styles.title}>{item.name}</Text>}
							description={()=><Text style={styles.description}>Classificação: {item.rate} estrelas</Text>}
							accessoryLeft={(props) => (
								<Avatar {...props} style={styles.avatar} source={item.imageUrl} />
							)}
						/>
					)}
    		/>
		
				<Button style={styles.button} onPress={()=>{}}>CONTINUAR</Button>
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
