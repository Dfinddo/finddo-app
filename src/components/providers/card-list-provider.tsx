import React, {createContext, useState, FC} from "react";
import CardListStore from "stores/card-list-store";

const CardListContext = createContext(new CardListStore());

const CardListProvider: FC = ({children}) => {
	const [store, setStore] = useState(new CardListStore());

	return (
		<CardListContext.Provider value={store}>
			{children}
		</CardListContext.Provider>
	);
};

export {CardListContext, CardListProvider};
