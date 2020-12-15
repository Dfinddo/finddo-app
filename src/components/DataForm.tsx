/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useState } from "react";
import {StyleSheet, ScrollView, View} from "react-native";
import {Layout, Text, Calendar, SelectItem, Button} from "@ui-kitten/components";
import {range, validations} from "utils";
import ValidatedSelect from "./ValidatedSelect";
import {localeDateService} from "src/utils/calendarLocale";
import { Service } from "stores/modules/services/types";

// const defaultTests = [validations.required()];

export interface DataFormOnSubmitProps {
	hora_inicio: string;
	hora_fim: string;
	serviceDate: Date;
}
interface DataFormProps {
	serviceStore: Service;
	onSubmit(data: DataFormOnSubmitProps): Promise<void>;
	forceErrorDisplay?: boolean;
	initialDate?: Date;
	finalDate?: Date;
}

const DataForm = ((props: DataFormProps): JSX.Element => {
	const {
		serviceStore,
		forceErrorDisplay,
		onSubmit,
		initialDate: initial,
		finalDate: final,
	} = props;

	const [startTime, setStartTime] = useState("--:--");
	const [endTime, setEndTime] = useState("--:--");
	const [serviceDate, setServiceDate] = useState<Date>(new Date());
	// const [newServiceStore, setNewServiceStore] = useState<Service>();

	const initialDate = initial || new Date();
	const finalDate = final || new Date();

	useEffect(() => {
		setStartTime(serviceStore.hora_inicio);
		setEndTime(serviceStore.hora_fim);
		setServiceDate(serviceStore.serviceDate);
	}, [serviceStore])

	// if(!serviceStore) return <View></View>

	if (!final) finalDate.setDate(initialDate.getDate() + 6);

	const endTimes = avaliableTimes.filter(
		time => time > startTime,
	);

	const onStartSelect = (index: number): void => {
		setStartTime(avaliableTimes[index]);

		if (startTime >= endTime) setEndTime("");
	};

	const onEndSelect = (index: number) =>
		void (setEndTime(endTimes[index]));

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
					date={serviceDate}
					onSelect={date => (setServiceDate(date))}
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
							value={startTime}
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
							value={endTime}
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

				<Button onPress={async() => {
					await onSubmit({
						hora_inicio: startTime,
						hora_fim: endTime,
						serviceDate,
					})}
				}>
					CONFIRMAR
				</Button>
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
