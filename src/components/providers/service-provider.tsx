import React, {createContext, useState, FC} from "react";
import ServiceStore from "stores/service-store";

const ServiceContext = createContext(new ServiceStore());

const ServiceProvider: FC = ({children}) => {
	const [store, setStore] = useState(new ServiceStore());

	return (
		<ServiceContext.Provider value={store}>
			{children}
		</ServiceContext.Provider>
	);
};

export {ServiceContext, ServiceProvider};
