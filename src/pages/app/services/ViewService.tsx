import React, {useEffect, useState} from "react";
import {StyleSheet} from "react-native";
import {useServiceList} from "hooks";
import {observer} from "mobx-react-lite";
import {StackScreenProps} from "@react-navigation/stack";
import {ServiceStackParams} from "src/routes/app";
import ServiceDataDisplay from "components/ServiceDataDisplay";
import ServiceStore from "stores/service-store";

type ViewServiceScreenProps = StackScreenProps<
	ServiceStackParams,
	"ViewService"
>;

const ViewService = observer<ViewServiceScreenProps>(({navigation, route}) => {
	const [serviceStore, setServiceStore] = useState<ServiceStore | undefined>();
	const serviceListStore = useServiceList();

	useEffect(() => {
		if (route.params?.id)
			setServiceStore(
				serviceListStore.list.find(({id}) => route.params.id === id),
			);
	}, [route.params?.id, serviceListStore.list]);

	if (serviceStore === void 0) return null;

	return <ServiceDataDisplay serviceStore={serviceStore} />;
});

export default ViewService;

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
	},
	description: {
		padding: 24,
	},
	descriptionWrapper: {marginTop: 24},
	blockStart: {marginTop: 24},
	serviceImage: {height: 200, width: "100%"},
});
