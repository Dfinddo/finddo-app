import React, {useState, useEffect, useCallback} from "react";
import {View, RefreshControl, Alert, StyleSheet} from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";
import {
	Button,
	List,
	ListItem,
	Icon,
	Divider,
	SelectItem,
	Layout,
	useTheme,
	TabBar,
	Tab,
} from "@ui-kitten/components";
import {useUser, useServiceList} from "hooks";
import {observer} from "mobx-react-lite";
import {
	serviceCategories,
	serviceStatusDescription,
	ServiceStatus,
} from "finddo-api";
import ServiceStore from "stores/service-store";
import {StackScreenProps} from "@react-navigation/stack";
import {ServicesStackParams} from "src/routes/app";
import Tutorial from "components/Tutorial";
import ValidatedSelect from "components/ValidatedSelect";

const serviceStatus = [
	"",
	"analise",
	"agendando_visita",
	"a_caminho",
	"em_servico",
	"finalizado",
	"cancelado",
] as const;

type MyServicesScreenProps = StackScreenProps<
	ServicesStackParams,
	"MyServices"
>;

const MyServices = observer<MyServicesScreenProps>(({navigation}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const serviceListStore = useServiceList();
	const userStore = useUser();
	const theme = useTheme();

	const getServices = useCallback(async (): Promise<void> => {
		setIsLoading(true);

		try {
			await serviceListStore.fetchServices(
				userStore,
				userStore.userType === "professional" && selectedIndex === 1,
			);
		} catch (error) {
			if (error.response) {
				Alert.alert("Erro", "Verifique sua conexão e tente novamente");
			} else if (error.request) {
				Alert.alert(
					"Falha ao se conectar",
					"Verifique sua conexão e tente novamente",
				);
			} else throw error;
		} finally {
			setIsLoading(false);
		}
	}, [userStore, serviceListStore, selectedIndex]);

	useEffect(() => void getServices(), [getServices]);

	const handleExpandList = useCallback(async (): Promise<void> => {
		setIsLoading(true);

		try {
			await serviceListStore.expandServiceList();
		} catch (error) {
			if (error.response) {
				Alert.alert("Erro", "Verifique sua conexão e tente novamente");
			} else if (error.request) {
				Alert.alert(
					"Falha ao se conectar",
					"Verifique sua conexão e tente novamente",
				);
			} else throw error;
		} finally {
			setIsLoading(false);
		}
	}, [serviceListStore]);

	const handleChangeFilter = useCallback(
		async (status: "" | ServiceStatus) => {
			setIsLoading(true);

			try {
				await serviceListStore.setStatusFilter(status);
			} catch (error) {
				if (error.response) {
					Alert.alert("Erro", "Verifique sua conexão e tente novamente");
				} else if (error.request) {
					Alert.alert(
						"Falha ao se conectar",
						"Verifique sua conexão e tente novamente",
					);
				} else throw error;
			} finally {
				setIsLoading(false);
			}
		},
		[serviceListStore],
	);

	return (
		<Layout level="2" style={styles.container}>
			<Tutorial />
			{userStore.userType === "professional" && (
				<TabBar
					style={styles.tab}
					selectedIndex={selectedIndex}
					onSelect={index => setSelectedIndex(index)}
				>
					<Tab title="Novos serviços" />
					<Tab title="Meus serviços" />
				</TabBar>
			)}
			{!(userStore.userType === "professional" && selectedIndex !== 1) ? (
				<View style={styles.optionsContainer}>
					<ValidatedSelect
						style={styles.select}
						label="Filtrar por status"
						value={serviceStatusDescription[serviceListStore.status]}
						onSelect={index => handleChangeFilter(serviceStatus[index])}
					>
						{serviceStatus.map((status, i) => (
							<SelectItem
								key={i}
								title={serviceStatusDescription[status]}
							/>
						))}
					</ValidatedSelect>
				</View>
			) : null}

			<View style={styles.listWrapper}>
				<List
					data={serviceListStore.list}
					ItemSeparatorComponent={Divider}
					onEndReached={handleExpandList}
					onEndReachedThreshold={0.2}
					refreshControl={
						<RefreshControl
							colors={[theme["color-primary-active"]]}
							refreshing={isLoading}
							onRefresh={getServices}
						/>
					}
					renderItem={({item}: {item: ServiceStore}) => (
						<ListItem
							onPress={() => {
								if (
									userStore.userType === "professional" &&
									item.status === "analise"
								) {
									navigation.navigate("ViewService", {id: item.id!});
								} else {
									navigation.navigate("ServiceStatus", {id: item.id!});
								}
							}}
							title={serviceCategories[item.categoryID!].name}
							description={serviceStatusDescription[item.status]}
							accessoryRight={props => (
								<Icon
									{...props}
									style={styles.icon}
									name="arrow-ios-forward"
									fill={"#AAA"}
								/>
							)}
						/>
					)}
				/>

				{userStore.userType === "user" && (
					<Button
						style={styles.button}
						onPress={() => navigation.navigate("NewService")}
					>
						NOVO PEDIDO
					</Button>
				)}
			</View>
		</Layout>
	);
});

export default MyServices;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	tab: {
		width: "100%",
		height: 58,
	},
	optionsContainer: {
		marginTop: 24,
		flexDirection: "row-reverse",
		alignItems: "center",
		justifyContent: "space-between",
	},
	select: {width: "80%"},
	icon: {width: 24, height: 24},
	listWrapper: {height: "85%", width: "100%"},
	button: {
		marginVertical: "5%",
		marginHorizontal: "12%",
	},
});
