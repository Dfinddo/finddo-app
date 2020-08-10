import React, {useState} from "react";
import {View, StyleSheet} from "react-native";
import {
	Text,
	Modal,
	Button,
	SelectItem,
	Calendar,
	Layout,
} from "@ui-kitten/components";
import {useService, useSwitch} from "hooks";
import {observer} from "mobx-react-lite";
import {range} from "utils";
import {StackScreenProps} from "@react-navigation/stack";
import {NewServiceStackParams} from "src/routes/app";
import ValidatedSelect from "components/ValidatedSelect";

type ServiceDateScreenProps = StackScreenProps<
	NewServiceStackParams,
	"ServiceDate"
>;

const ServiceDate = observer<ServiceDateScreenProps>(props => {
	const serviceStore = useService();
	const [hasFailedToFillForm, setFillAttemptAsFailed] = useSwitch(false);
	const initialDate = new Date();
	const finalDate = new Date();

	finalDate.setDate(finalDate.getDate() + 6);

	const endTimes = avaliableTimes.filter(
		time => time > serviceStore.startTime,
	);

	const onAdvanceAttempt = (): void => {
		if (!(serviceStore.startTime && serviceStore.endTime))
			setFillAttemptAsFailed();
		else props.navigation.navigate("ServicePhotos");
	};

	const onStartSelect = (index: number): void => {
		serviceStore.startTime = avaliableTimes[index];
		if (serviceStore.startTime >= serviceStore.endTime)
			serviceStore.endTime = "";
	};

	const onEndSelect = (index: number) =>
		void (serviceStore.endTime = endTimes[index]);

	return (
		<Layout level="2" style={styles.container}>
			<Layout level="1" style={styles.contentWrapper}>
				<Text category="h5">
					Escolha a melhor data e faixa de horário para seu atendimento:
				</Text>
				<Calendar
					date={serviceStore.serviceDate}
					onSelect={date => (serviceStore.serviceDate = date)}
					min={initialDate}
					max={finalDate}
				/>
				<View style={styles.row}>
					<Text style={styles.timeLabel} category="h6">
						Entre:{" "}
					</Text>
					<ValidatedSelect
						style={styles.timeSelect}
						value={serviceStore.startTime}
						error={serviceStore.startTimeError}
						forceErrorDisplay={hasFailedToFillForm}
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
						E:
					</Text>
					<ValidatedSelect
						style={styles.timeSelect}
						value={serviceStore.endTime}
						error={serviceStore.endTimeError}
						forceErrorDisplay={hasFailedToFillForm}
						placeholder={"--:--"}
						onSelect={onEndSelect}
					>
						{endTimes.map(time => (
							<SelectItem key={time} title={time} />
						))}
					</ValidatedSelect>
				</View>
			</Layout>
			<Button onPress={onAdvanceAttempt}>CONTINUAR</Button>
		</Layout>
	);
});

export default ServiceDate;

const avaliableTimes = range(9, 22)
	.map(hour => String(hour).padStart(2, "0"))
	.flatMap(hour => [`${hour}:00`, `${hour}:30`]);

const styles = StyleSheet.create({
	backgroundImageContent: {width: "100%", height: "100%"},
	container: {
		flex: 1,
		paddingTop: 10,
		alignItems: "center",
	},
	modalDialogContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	modalDialogContent: {
		width: 340,
		borderRadius: 18,
		opacity: 1,
		alignItems: "center",
	},
	modalErrosTitulo: {fontWeight: "bold", textAlign: "center", fontSize: 24},
	modalErrosContent: {
		fontSize: 18,
		marginVertical: 10,
	},
	intervalWrapper: {
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "space-between",
	},
	timeSelect: {width: "35%"},
	contentWrapper: {
		height: "90%",
		justifyContent: "space-around",
		alignItems: "center",
		paddingHorizontal: 15,
		margin: 5,
	},
	row: {
		width: "100%",
		alignItems: "center",
		justifyContent: "flex-end",
		flexDirection: "row",
		marginRight: "50%",
	},
	timeLabel: {textAlign: "right", marginRight: 15, marginBottom: 15},
});
