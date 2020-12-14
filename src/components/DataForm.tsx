import React, { useEffect, useState } from "react";
import {StyleSheet, ScrollView, View} from "react-native";
import {Layout, Text, Calendar, SelectItem} from "@ui-kitten/components";
import {range} from "utils";
import ValidatedSelect from "./ValidatedSelect";
import {localeDateService} from "src/utils/calendarLocale";
import { Service } from "stores/modules/services/types";

interface DataFormProps {
	serviceStore: Service;
	forceErrorDisplay?: boolean;
	initialDate?: Date;
	finalDate?: Date;
}

const DataForm = ((props: DataFormProps): JSX.Element => {
	const {
		serviceStore,
		forceErrorDisplay,
		initialDate: initial,
		finalDate: final,
	} = props;

	const [newServiceStore, setNewServiceStore] = useState<Service>();

	const initialDate = initial || new Date();
	const finalDate = final || new Date();

	useEffect(() => {
		setNewServiceStore(serviceStore);
	}, [serviceStore])

	if(!newServiceStore) return <View></View>

	if (!final) finalDate.setDate(initialDate.getDate() + 6);

	const endTimes = avaliableTimes.filter(
		time => time > newServiceStore.hora_inicio,
	);

	const onStartSelect = (index: number): void => {
		newServiceStore.hora_inicio = avaliableTimes[index];
		if (newServiceStore.hora_inicio >= newServiceStore.hora_fim)
			newServiceStore.hora_fim = "";
	};

	const onEndSelect = (index: number) =>
		void (newServiceStore.hora_fim = endTimes[index]);

	return (
		<Layout level="1" style={styles.contentWrapper}>
			<Text category="h5">
				Escolha a melhor data e faixa de horário para seu atendimento:
			</Text>
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={styles.calendarContainer}
			>
				<Calendar
					style={styles.calendar}
					dateService={localeDateService}
					date={newServiceStore.serviceDate}
					onSelect={date => (newServiceStore.serviceDate = date)}
					min={initialDate}
					max={finalDate}
				/>
				<View style={styles.rowContainer}>
					<View style={styles.row}>
						<Text style={styles.timeLabel} category="h6">
							Entre:{" "}
						</Text>
						<ValidatedSelect
							style={styles.timeSelect}
							value={newServiceStore.hora_inicio}
							forceErrorDisplay={forceErrorDisplay}
							placeholder={"--:--"}
							onSelect={onStartSelect}
						>
							{avaliableTimes.map(time => (
								<SelectItem key={time} title={time} />
							))}
						</ValidatedSelect>
					</View>
					<View style={styles.row}>
						<Text style={styles.timeLabel} category="h6">
							{"        "}E:{" "}
						</Text>
						<ValidatedSelect
							style={styles.timeSelect}
							value={newServiceStore.hora_fim}
							forceErrorDisplay={forceErrorDisplay}
							placeholder={"--:--"}
							onSelect={onEndSelect}
						>
							{endTimes.map(time => (
								<SelectItem key={time} title={time} />
							))}
						</ValidatedSelect>
					</View>
				</View>
			</ScrollView>
		</Layout>
	);
});

export default DataForm;

const avaliableTimes = range(9, 22)
	.map(hour => String(hour).padStart(2, "0"))
	.flatMap(hour => [`${hour}:00`, `${hour}:30`]);

const styles = StyleSheet.create({
	// modalDialogContainer: {
	// 	flex: 1,
	// 	alignItems: "center",
	// 	justifyContent: "center",
	// },
	// modalDialogContent: {
	// 	width: 340,
	// 	borderRadius: 18,
	// 	opacity: 1,
	// 	alignItems: "center",
	// },
	calendarContainer: {width: "100%", padding: "5%"},
	calendar: {alignSelf: "center"},
	// modalErrosTitulo: {fontWeight: "bold", textAlign: "center", fontSize: 24},
	// modalErrosContent: {
	// 	fontSize: 18,
	// 	marginVertical: 10,
	// },
	timeSelect: {width: "35%"},
	timeLabel: {textAlign: "right", marginBottom: 15},
	contentWrapper: {
		height: "95%",
		justifyContent: "flex-start",
		alignItems: "center",
		paddingHorizontal: 15,
	},
	rowContainer: {
		flex: 1,
		width: "100%",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 16,
	},
	row: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
		flexDirection: "row",
	},
});
