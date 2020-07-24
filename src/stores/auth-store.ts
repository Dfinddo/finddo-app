import {observable, computed, action} from "mobx";
import {validations, validateInput, pick} from "utils";
import AsyncStorage from "@react-native-community/async-storage";
import finddoApi from "finddo-api";
import {BACKEND_URL} from "config";
import AddressStore from "./address-store";

const firstNameTests = [validations.required(), validations.maxLength(70)];
const nameTests = [validations.required(), validations.maxLength(255)];
const emailTests = [
	validations.required(),
	validations.validEmail(),
	validations.maxLength(128),
];
const cellphoneTests = [validations.required(), validations.definedLength(11)];
const cpfTests = [validations.required(), validations.definedLength(11)];

class AuthStore {
	@observable public userType: "user" | "professional" = "user";

	@observable public id = "";

	@observable public profilePicture = require("../assets/sem-foto.png");

	@observable public name = "";
	@computed public get nameError(): string | undefined {
		return validateInput(this.name, firstNameTests);
	}

	@observable public surname = "";
	@computed public get surnameError(): string | undefined {
		return validateInput(this.surname, nameTests);
	}

	@observable public mothersName = "";
	@computed public get mothersNameError(): string | undefined {
		return validateInput(this.mothersName, nameTests);
	}

	@observable public email = "";
	@computed public get emailError(): string | undefined {
		return validateInput(this.email, emailTests);
	}

	@observable public cellphone = "";
	@computed public get cellphoneError(): string | undefined {
		return validateInput(this.cellphone, cellphoneTests);
	}

	@observable public cpf = "";
	@computed public get cpfError(): string | undefined {
		return validateInput(this.cpf, cpfTests);
	}

	@observable public birthdate: Date | null = new Date();
	@computed public get birthdateError(): string | undefined {
		if (!this.birthdate) return "Required";
	}

	public billingAddress = new AddressStore();

	public isRegistered = async (): Promise<boolean> => {
		try {
			await finddoApi.get(
				`/users?email=${this.email}&cellphone=${this.cellphone}&cpf=${this.cpf}`,
			);

			return false;
		} catch (error) {
			if (error.response && error.response.status === 403) return true;
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	};

	public signIn = async (email: string, password: string): Promise<void> => {
		try {
			const response = await finddoApi.post("/auth/sign_in", {
				email,
				password,
			});
			const {
				headers,
				data: {data},
			} = response;
			const {user_type: userType, ...userData} = data;

			if (data.activated === false) throw new Error("Account not validated");

			finddoApi.defaults.headers["access-token"] = headers["access-token"];
			finddoApi.defaults.headers.client = headers.client;
			finddoApi.defaults.headers.uid = headers.uid;

			Object.assign(this, userData, {userType});
			AsyncStorage.setItem("userToken", JSON.stringify(headers));
			AsyncStorage.setItem("user", JSON.stringify(this));

			// await finddoApi.put(`users/player_id_notifications/${this.id}`,
			// 	{player_id: this.oneSignalID});
		} catch (error) {
			console.log({error});
			if (error.response) throw new Error("Invalid credentials");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	};

	public signOut = async (): Promise<void> => {
		await AsyncStorage.multiRemove(["user", "userToken"]);

		this.id = this.email = this.cellphone = this.name = this.surname = this.cpf =
			"";
		this.userType = "user";

		// finddoApi.delete(
		// 	`users/remove_player_id_notifications/${this.id}/${tokenService.getPlayerIDOneSignal()}`,
		// );

		delete finddoApi.defaults.headers["access-token"];
		delete finddoApi.defaults.headers.client;
		delete finddoApi.defaults.headers.uid;
	};

	public signUp = async () => {
		try {
			const response = await finddoApi.post("/users", user);

			// Professional accounts must be approved for use
			if (user.user_type === "professional") return;

			finddoApi.defaults.headers["access-token"] =
				response.headers["access-token"];
			finddoApi.defaults.headers.client = response.headers.client;
			finddoApi.defaults.headers.uid = response.headers.uid;

			this.id = data.id;

			AsyncStorage.setItem("user", JSON.stringify(user));
		} catch (error) {
			if (error.response) throw new Error("Invalid user data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	};

	public restoreSession = async () => {
		const [userData, headers] = (
			await AsyncStorage.multiGet(["user", "userToken"])
		).map(([, value]) => value && JSON.parse(value));

		if (!userData || !headers) return;

		finddoApi.defaults.headers["access-token"] = headers["access-token"];
		finddoApi.defaults.headers.client = headers.client;
		finddoApi.defaults.headers.uid = headers.uid;
		Object.assign(this, userData);
	};

	public getProfilePicture = async () => {
		try {
			const data = await finddoApi.get(`/users/profile_photo/${this.id}`);

			if (data.data.photo)
				this.profilePicture = {uri: `${backendUrl}/${data.data.photo}`};
		} catch (error) {
			if (error.response) throw new Error("Invalid user data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	};

	public setProfilePicture = async profilePicture => {
		try {
			finddoApi.put(`/users/profile_photo/${this.id}`, {
				profile_photo: {
					base64: profilePicture.base64,
					file_name: `profile-${this.id}`,
				},
			});
		} catch (error) {
			if (error.response) throw new Error("Invalid user data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	};

	public recoverPassword = async (email: string): Promise<void> => {
		try {
			await finddoApi.post("auth/password", {
				email,
				redirect_url: BACKEND_URL,
			});
		} catch (error) {
			if (error.response) throw new Error("Email not found");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	};
}

export default AuthStore;
