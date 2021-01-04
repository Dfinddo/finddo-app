import React, {useState, useCallback} from "react";
import {Pressable, View, Alert, StyleSheet, Modal} from "react-native";
import {
	Button,
	Layout,
	Avatar,
	TopNavigation,
	TopNavigationAction,
	Icon,
	Text,
} from "@ui-kitten/components";
import DataPieceDisplay from "components/DataPieceDisplay";
import {StackScreenProps} from "@react-navigation/stack";
import {AppDrawerParams} from "src/routes/app";
import ImagePicker from "react-native-image-crop-picker";
import ValidatedInput from "components/ValidatedInput";
import {phoneFormatter, cpfFormatter, numericFormattingFilter} from "utils";
import ValidatedMaskedInput from "components/ValidatedMaskedInput";
import { useDispatch, useSelector } from "react-redux";
import { State } from "stores/index";
import { UserState } from "stores/modules/user/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OneSignal from "react-native-onesignal";
import finddoApi from "finddo-api";
import { signOut, updateProfilePhoto } from "stores/modules/user/actions";
import { BACKEND_URL_STORAGE } from "@env";

type ProfileScreenProps = StackScreenProps<AppDrawerParams, "Profile">;

const Profile = ((props: ProfileScreenProps): JSX.Element => {
	const dispatch = useDispatch();
	const userStore = useSelector<State, UserState>(state => state.user);
	const [isEditing, setIsEditing] = useState(false);
	const [fieldToEdit, setFieldToEdit] = useState<keyof UserState>("email");

	const editProfile = (field: keyof UserState) => () => {
		setFieldToEdit(field);
		setIsEditing(true);
	};

	const updateProfileImage = useCallback(async (image: {data: string}) => {
		try {
			const response = await finddoApi.put(
				`/users/profile_photo/${userStore.id}`,
				{
					profile_photo: {
						base64: image.data,
						file_name: `profile-${userStore.id}`,
					},
				},
			);

			dispatch(updateProfilePhoto({
				uri: `${BACKEND_URL_STORAGE}${response.data.photo}`,
			}));
		} catch (error) {
			if (error.response) throw new Error("Invalid user data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	}, [dispatch, userStore.id]);

	const handleLogout = useCallback((): void => {
		Alert.alert("Finddo", "Deseja sair?", [
			{text: "Não"},
			{
				text: "Sim",
				onPress: async () => {
					props.navigation.navigate("Services");
					await AsyncStorage.multiRemove(["user", "access-token"]);

					OneSignal.getPermissionSubscriptionState(
						(status: {userId: string}) => 
							finddoApi.delete(
							`users/remove_player_id_notifications/${userStore.id}/${status.userId}`
							).then(() => delete finddoApi.defaults.headers.Authorization)
					);

					OneSignal.removeExternalUserId();

					dispatch(signOut());
				},
			},
		]);
	}, [userStore, props, dispatch]);

	const changeProfilePicture = useCallback((): void => {
		Alert.alert(
			"Alterar foto de perfil",
			"Deseja tirar uma nova foto ou escolher da galeria?",
			[
				{text: "Cancelar"},
				{
					text: "Tirar uma nova foto",
					onPress: () =>
						ImagePicker.openCamera({includeBase64: true}).then(image => {
							updateProfileImage(image as {data: string});
						}),
				},
				{
					text: "Adicionar foto da galeria",
					onPress: () =>
						ImagePicker.openPicker({includeBase64: true}).then(image => {
							updateProfileImage(image as {data: string});
						}),
				},
			],
		);
	}, [updateProfileImage]);

	return (
		<Layout level="1" style={styles.container}>
			<ProfileEditModal
				visible={isEditing}
				field={fieldToEdit}
				onClose={() => setIsEditing(false)}
			/>
			<Pressable onPress={changeProfilePicture}>
				<Avatar style={styles.avatar} source={userStore.profilePicture} />
			</Pressable>
			<View style={styles.userDataContainer}>
				<DataPieceDisplay hint="Nome" value={userStore.name} />
				<DataPieceDisplay
					onPress={editProfile("email")}
					hint="E-mail"
					value={userStore.email}
				/>
				<DataPieceDisplay
					onPress={editProfile("cellphone")}
					hint="Telefone"
					value={phoneFormatter(userStore.cellphone)}
				/>
				<DataPieceDisplay hint="CPF" value={cpfFormatter(userStore.cpf)} />
			</View>
			<Button onPress={handleLogout}>SAIR</Button>
		</Layout>
	);
});

export default Profile;

interface ProfileEditModalProps {
	visible: boolean;
	field: keyof UserState;
	onClose: () => void;
}

const ProfileEditModal = ((props: ProfileEditModalProps): JSX.Element => {
	const [input, setInput] = useState("");

	const closeModal = (): void => {
		setInput("");
		props.onClose();
	};

	return (
		<Modal animationType="slide" visible={props.visible}>
			<TopNavigation
				title={() => (
					<Text category="h6">
						Alterar {mutableFields[props.field as MutableFields]}
					</Text>
				)}
				accessoryLeft={() => (
					<TopNavigationAction
						onPress={closeModal}
						icon={props => <Icon {...props} name="arrow-back" />}
					/>
				)}
			/>
			<Layout style={styles.modalContainer}>
				<View>
					{
						{
							email: (
								<ValidatedInput value={input} onChangeText={setInput} />
							),
							cellphone: (
								<ValidatedMaskedInput
									keyboardType="numeric"
									maxLength={15}
									value={input}
									formatter={phoneFormatter}
									formattingFilter={numericFormattingFilter}
									onChangeText={setInput}
								/>
							),
						}[props.field as MutableFields]
					}
					<Button>SALVAR</Button>
				</View>
			</Layout>
		</Modal>
	);
});

const mutableFields = {email: "E-mail", cellphone: "Telefone"} as const;

type MutableFields = keyof typeof mutableFields;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "space-around",
	},
	modalContainer: {flex: 1, padding: 15, justifyContent: "space-around"},
	userDataContainer: {width: "80%", marginBottom: "16%"},
	avatar: {width: 150, height: 150},
});
