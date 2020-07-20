import {observable, action, runInAction} from "mobx";
import AddressStore from "stores/address-store";
import AuthStore from "stores/auth-store";
import finddoApi from "finddo-api";

class AddressListStore {
	@observable
	public list: AddressStore[] = [];

	@action
	public async fetchAddresses(authStore: AuthStore): Promise<void> {
		try {
			const data = await finddoApi.get(`/addresses/user/${authStore.id}`);
			const addresses = data.data;
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
