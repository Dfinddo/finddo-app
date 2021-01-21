/* eslint-disable no-nested-ternary */
import React, {useState, useEffect, useCallback, useMemo} from "react";
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
import finddoApi, {
	serviceStatusDescription,
	ServiceStatus,
	serviceCategories,
	UserApiResponse,
} from "finddo-api";
import {StackScreenProps} from "@react-navigation/stack";
import {ServicesStackParams} from "src/routes/app";
import Tutorial from "components/Tutorial";
import ValidatedSelect from "components/ValidatedSelect";
import { useDispatch, useSelector } from "react-redux";
import { State } from "stores/index";
import { UserState } from "stores/modules/user/types";
import { Service, ServiceList } from "stores/modules/services/types";
import { setServices } from "stores/modules/services/actions";

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

const MyServices = (({navigation}: MyServicesScreenProps): JSX.Element => {
	const [visible, setVisible] = React.useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [status, setStatus] = useState<"" | ServiceStatus>("");
	const dispatch = useDispatch();
	const serviceListStore = useSelector<State, ServiceList>(state => state.services.list);
	const userStore = useSelector<State, UserState>(state => state.user);
	const theme = useTheme();

	const url = useMemo<string>(()=>{
		if (userStore.user_type === "user") return `/orders/user/active`;
		
		return selectedIndex === 0 ? "/orders/available" : `orders/active_orders_professional`;
	}, [userStore, selectedIndex]);

	const getServices = useCallback(async (): Promise<void> => {
		setIsLoading(true);
		try {
			const response = await finddoApi.get(`${url}/?page=1`);
			
			const {items, total_pages: total} = response.data;

			dispatch(setServices({
				items,
				page: 1,
				total,
			}));
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
	}, [url, dispatch]);

	useEffect(() => void getServices(), [getServices]);

	const handleExpandList = useCallback(async (): Promise<void> => {
		if(serviceListStore.page + 1 > serviceListStore.total) return;

		setIsLoading(true);

		try {
			const params =
				status !== ""
					? {page: serviceListStore.page, order_status: status}
					: {page: serviceListStore.page};

			const response = await finddoApi.get(url, {params});

			const {items, total_pages} = response.data;

			dispatch(setServices({
				items: [...serviceListStore.items, ...items],
				page: serviceListStore.page + 1,
				total: total_pages,
			}))
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
	}, [serviceListStore, dispatch, status, url]);

	const handleChangeFilter = useCallback(
		async (status: "" | ServiceStatus) => {
			setIsLoading(true);

			try {
				setStatus(status);

				const params =
				status !== "" ? {page: 1, order_status: status} : {page: 1};

				const response = await finddoApi.get(url, {params});
				const {items, total_pages} = response.data;

				dispatch(setServices({
					items,
					page: 1,
					total: total_pages,
				}));
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
		[dispatch, url],
	);

	function handleServiceDetails(id: number, professional: UserApiResponse | null ): void {
		if (
			userStore.user_type === "professional" &&
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
			{userStore.user_type === "professional" && (
				<TabBar
					style={styles.tab}
					selectedIndex={selectedIndex}
					onSelect={index => setSelectedIndex(index)}
				>
					<Tab title="Novos serviços" />
					<Tab title="Meus serviços" />
				</TabBar>
			)}
			{!(userStore.user_type === "professional" && selectedIndex !== 1) ? (
				<View style={styles.optionsContainer}>
					<ValidatedSelect
						style={styles.select}
						label="Filtrar por status"
						value={serviceStatusDescription[status]}
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
						data={serviceListStore.items}
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
						renderItem={({item}: {item: Service}) => (
							<ListItem
								onPress={()=>handleServiceDetails(item.id!, item.professional_order)}
								title={_evaProps => (
									<Text
										status={
											item.order_status === "analise"
												? "basic"
												: item.order_status === "cancelado"
												? "danger"
												: "primary"
										}
									>
										{serviceCategories[item.category.id!].name}
									</Text>
								)}
								description={serviceStatusDescription[item.order_status]}
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

				{userStore.user_type === "user" && (
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
        <Card style={styles.modalCardStyle} disabled={true}>
					<Button 
						style={styles.modalButton} 
						status="basic" 
						onPress={() => {
							setVisible(false);
							navigation.navigate("NewService")
					}}>
            Avançar para criação de um novo serviço
          </Button>
					<Button 
						style={styles.modalButton} 
						status="basic" 
						onPress={() => {
							setVisible(false);
							navigation.navigate("NewService",{screen: "ServiceProfessionalPreference"})
					}}>
            Selecionar um profissional de sua confiança
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
	modalCardStyle: {
		width:"95%",
		borderRadius: 4,
		alignSelf: "center",
	}, 
	modalButton: {	margin: 8, borderColor: "black" },
	backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
