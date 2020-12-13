/* eslint-disable @typescript-eslint/naming-convention */
import { UserState } from '../user/types'; 

export enum ProfessionalListActionTypes {
	setProfessionalList= "SET_PROFESSIONAL_LIST",
}

export interface ProfessionalsState {
	list: UserState[],
	current_page: number,
	total_pages: number,
}

