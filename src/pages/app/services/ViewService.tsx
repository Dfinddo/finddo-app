import React, {useEffect, useState} from "react";
import {useServiceList} from "hooks";
import {observer} from "mobx-react-lite";
import {StackScreenProps} from "@react-navigation/stack";
import {ServicesStackParams} from "src/routes/app";
import ServiceDataDisplay from "components/ServiceDataDisplay";
import ServiceStore from "stores/service-store";

type ViewServiceScreenProps = StackScreenProps<
	ServicesStackParams,
	"ViewService"
>;

const ViewService = observer<ViewServiceScreenProps>(({route}) => {
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
