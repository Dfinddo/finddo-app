/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/naming-convention */
import { observable, action, runInAction, makeObservable } from "mobx";
import UserStore from "stores/user-store";
import finddoApi, { UserApiResponse} from "finddo-api";

class ProfessionalsListStore {
    @observable
	public list: UserStore[] = [];

    @observable
	public current_page: number|undefined;

    @observable
	public total_pages: number|undefined;

    constructor() {
        makeObservable(this);
    }

    @action
	public async fetchProfessionals(name: string, page = 1): Promise<void> {
		try {
			const response = await finddoApi.post(`/users/find_by_name`, {
				user: {name},
				page,
			});

			const users: UserApiResponse[] = response.data.items.map(
				(item:{data:{attributes: UserApiResponse}})=>item.data.attributes
			);

			const userList = users.map(user =>
				UserStore.createFromApiResponse(user),
			);

			runInAction(() => {
				this.current_page = page;
				this.list = this.current_page===1 ? userList : this.list.concat(userList);
				this.total_pages = response.data.total_pages;
			});
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error)
			if (error.response) throw new Error("Invalid name data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	}
}

export default ProfessionalsListStore;
