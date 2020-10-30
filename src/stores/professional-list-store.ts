/* eslint-disable @typescript-eslint/naming-convention */
import {observable, action, runInAction} from "mobx";
import UserStore from "stores/user-store";
import finddoApi, { UserApiResponse} from "finddo-api";

class ProfessionalsListStore {
	@observable
	public list: UserStore[] = [];

	@observable
	public current_page: number|undefined;

	@observable
	public total_pages: number|undefined;

	@action
	public async fetchProfessionals(name: string, page = 1): Promise<void> {
		try {
			const response = await finddoApi.post(`/users/find_by_name`, {
				name, 
				page,
			});

			console.log(response.data.items)
			const users: UserApiResponse[] = response.data.items;
			const userList = users.map(user =>
				UserStore.createFromApiResponse(user),
			);

			runInAction(() => {
				this.list = userList;
				this.current_page = page;
				this.total_pages = response.data.total_pages;
			});
		} catch (error) {
			console.log(error)
			if (error.response) throw new Error("Invalid name data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	}
}

export default ProfessionalsListStore;
