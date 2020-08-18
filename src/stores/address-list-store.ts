import {observable, action, runInAction} from "mobx";
import AddressStore from "stores/address-store";
import UserStore from "stores/user-store";
import finddoApi, {AddressApiResponse} from "finddo-api";

class AddressListStore {
	@observable
	public list: AddressStore[] = [];

	@action
	public async fetchAddresses(userStore: UserStore): Promise<void> {
		try {
			const data = await finddoApi.get(`/addresses/user/${userStore.id}`);
			const addresses: AddressApiResponse[] = data.data;
			const addressList = addresses.map(address =>
				AddressStore.createFromApiResponse(address),
			);

			runInAction(() => (this.list = addressList));
		} catch (error) {
			if (error.response) throw new Error("Invalid address data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	}
}

export default AddressListStore;
