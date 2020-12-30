import { UserState } from '../user/types'; 

export enum ProfessionalListActionTypes {
	setProfessionalList= "SET_PROFESSIONAL_LIST",
}

interface SetProfessionalListAction {
	type: ProfessionalListActionTypes.setProfessionalList,
	payload: {
		data: ProfessionalsState,
	}
}

export type ProfessionalListActions = SetProfessionalListAction;

export interface ProfessionalsState {
	list: UserState[],
	current_page: number,
	total_pages: number,
}

