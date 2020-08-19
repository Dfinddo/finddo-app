import React, {createContext, useState, FC} from "react";
import AddressListStore from "stores/address-list-store";

const AddressListContext = createContext(new AddressListStore());

const AddressListProvider: FC = ({children}) => {
	const [store, setStore] = useState(new AddressListStore());

	return (
		<AddressListContext.Provider value={store}>
			{children}
		</AddressListContext.Provider>
	);
};

export {AddressListContext, AddressListProvider};
