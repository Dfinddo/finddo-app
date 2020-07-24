import React, {createContext, useState, FC} from "react";
import ServiceListStore from "stores/service-list-store";

const ServiceListContext = createContext(new ServiceListStore());

const ServiceListProvider: FC = ({children}) => {
	const [store, setStore] = useState(new ServiceListStore());

	return (
		<ServiceListContext.Provider value={store}>
			{children}
		</ServiceListContext.Provider>
	);
};

export {ServiceListContext, ServiceListProvider};
