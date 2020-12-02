/* eslint-disable react-native/no-color-literals */
/* eslint-disable no-nested-ternary */
import React, {useState, useEffect, useCallback} from "react";
import {View, RefreshControl, Alert, StyleSheet} from "react-native";
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
	Text,
	Modal,
	Card,
} from "@ui-kitten/components";
import {useUser, useServiceList} from "hooks";
import {observer} from "mobx-react-lite";
import {
	serviceStatusDescription,
	ServiceStatus,
	serviceCategories,
	UserApiResponse,
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
	const [visible, setVisible] = React.useState(false);
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

	function handleServiceDetails(id: number, professional: UserApiResponse | null ): void {
		if (
			userStore.userType === "professional" &&
			!professional
		) {
			navigation.navigate("ViewService", {
				id,
			});
		} else {
			navigation.navigate("ServiceStatus", {
				id,
			});
		}
	}

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
				{
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
						ListEmptyComponent={
							<>
							{!isLoading &&
							<View style={styles.emptyList}>
								<Icon
									style={styles.iconAlert}
									fill="#8F9BB3"
									name="alert-circle-outline"
								/>
								<Text style={styles.emptyListText}>
									Ainda não possui nenhum serviço ativo
								</Text>
							</View>}
							</>
						}
						renderItem={({item}: {item: ServiceStore}) => (
							<ListItem
								onPress={()=>handleServiceDetails(item.id!, item.professional_order)}
								title={_evaProps => (
									<Text
										status={
											item.status === "analise"
												? "basic"
												: item.status === "cancelado"
												? "danger"
												: "primary"
										}
									>
										{serviceCategories[item.categoryID!].name}
									</Text>
								)}
								description={serviceStatusDescription[item.status]}
								accessoryRight={props => (
									<Icon
										{...props}
										style={styles.icon}
										name="arrow-ios-forward"
										fill={"#AAA"}
									/>
								)}
								accessoryLeft={props => (
										<>
											{item.urgency === "urgent" && <Icon
												{...props}
												style={styles.icon}
												name="bell"
												fill={"#c6d316"}
											/>}
									</>
									)
								}
							/>
						)}
					/>
				}

				{userStore.userType === "user" && (
					<Button
						style={styles.button}
						onPress={() => setVisible(true)}
					>
						NOVO PEDIDO
					</Button>
				)}
			</View>

			<Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}>
        <Card disabled={true}>
					<Button 
						style={styles.modalButton} 
						status="basic" 
						onPress={() => {
							setVisible(false);
							navigation.navigate("NewService")
					}}>
            Qualquer profissional
          </Button>
					<Button 
						style={styles.modalButton} 
						status="basic" 
						onPress={() => {
							setVisible(false);
							navigation.navigate("NewService",{screen: "ServiceProfessionalPreference"})
					}}>
            Associar um profissional ao meu pedido
          </Button>
					<Button style={styles.modalButton} status="danger" onPress={() => setVisible(false)}>
            Cancelar
          </Button>
        </Card>
      </Modal>
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
	iconAlert: {width: 64, height: 64, marginTop: 32},
	listWrapper: {height: "85%", width: "100%"},
	emptyList: {
		flex: 1,
		height: "65%",
		width: "100%",
		alignItems: "center",
		justifyContent: "space-around",
	},
	emptyListText: {
		width: "75%",
		fontSize: 24,
		color: "#8F9BB3",
		textAlign: "center",
		marginBottom: "30%",
		marginTop:32,
	},
	button: {
		marginVertical: "10%",
		marginHorizontal: "5%",
	},
	modalButton: {	margin: 8, borderColor: "black" },
	backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
