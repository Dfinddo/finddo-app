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
} from "@ui-kitten/components";
import {useUser, useServiceList} from "hooks";
import {observer} from "mobx-react-lite";
import {serviceCategories, serviceStatusDescription} from "finddo-api";
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

const MyServices = observer<MyServicesScreenProps>(({navigation, route}) => {
	const [isLoading, setIsLoading] = useState(false);
	const serviceListStore = useServiceList();
	const [selectValue, setSelectValue] = useState(0);
	const userStore = useUser();
	const theme = useTheme();

	const obterPedidos = useCallback(async (): Promise<void> => {
		setIsLoading(true);

		try {
			await serviceListStore.fetchServices(userStore);
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
	}, [userStore, serviceListStore]);

	useEffect(() => void obterPedidos(), [obterPedidos]);

	return (
		<Layout level="2" style={styles.container}>
			<Tutorial />
			<ValidatedSelect
				style={styles.select}
				label="Filtrar por status"
				value={serviceStatusDescription[serviceStatus[selectValue]]}
				onSelect={setSelectValue}
			>
				{serviceStatus.map((status, i) => (
					<SelectItem key={i} title={serviceStatusDescription[status]} />
				))}
			</ValidatedSelect>
			<View style={styles.listWrapper}>
				<List
					data={serviceListStore.list.filter(service =>
						serviceStatus[selectValue] === ""
							? true
							: service.status === serviceStatus[selectValue],
					)}
					ItemSeparatorComponent={Divider}
					refreshControl={
						<RefreshControl
							colors={[theme["color-primary-active"]]}
							refreshing={isLoading}
							onRefresh={obterPedidos}
						/>
					}
					renderItem={({item}: {item: ServiceStore}) => (
						<ListItem
							onPress={() =>
								navigation.navigate("ViewService", {id: item.id!})
							}
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
			</View>
			{userStore.userType === "user" && (
				<Button onPress={() => navigation.navigate("NewService")}>
					NOVO PEDIDO
				</Button>
			)}
		</Layout>
	);
});

export default MyServices;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 10,
		alignItems: "center",
	},
	select: {width: "90%"},
	icon: {width: 24, height: 24},
	listWrapper: {height: "80%", width: "100%"},
});
