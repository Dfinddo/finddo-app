import React, {createContext, useState, FC} from "react";
import ProfessionalListStore from "stores/professional-list-store";

const ProfessionalListContext = createContext(new ProfessionalListStore());

const ProfessionalListProvider: FC = ({children}) => {
	const [store, setStore] = useState(new ProfessionalListStore());

	return (
		<ProfessionalListContext.Provider value={store}>
			{children}
		</ProfessionalListContext.Provider>
	);
};

export {ProfessionalListContext, ProfessionalListProvider};
