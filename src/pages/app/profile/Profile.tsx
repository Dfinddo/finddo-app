import React, {useState, useEffect, useCallback} from "react";
import {Pressable, View, Alert, StyleSheet, Modal} from "react-native";
import {useUser} from "hooks";
import {
	Button,
	Layout,
	Avatar,
	TopNavigation,
	TopNavigationAction,
	Icon,
	Text,
} from "@ui-kitten/components";
import {observer} from "mobx-react-lite";
import DataPieceDisplay from "components/DataPieceDisplay";
import {StackScreenProps} from "@react-navigation/stack";
import {AppDrawerParams} from "src/routes/app";
import ImagePicker from "react-native-image-crop-picker";
import ValidatedInput from "components/ValidatedInput";
import UserStore from "stores/user-store";
import {phoneFormatter, cpfFormatter, numericFormattingFilter} from "utils";
import ValidatedMaskedInput from "components/ValidatedMaskedInput";

type ProfileScreenProps = StackScreenProps<AppDrawerParams, "Profile">;

const Profile = observer<ProfileScreenProps>(props => {
	const userStore = useUser();
	const [isEditing, setIsEditing] = useState(false);
	const [fieldToEdit, setFieldToEdit] = useState<keyof UserStore>("email");

	useEffect(() => {
		userStore.getProfilePicture();
	}, [userStore]);

	const editProfile = useCallback(
		(field: keyof UserStore) => () => {
			setFieldToEdit(field);
			setIsEditing(true);
		},
		[],
	);

	const logout = useCallback((): void => {
		Alert.alert("Finddo", "Deseja sair?", [
			{text: "Não"},
			{text: "Sim", onPress: userStore.signOut},
		]);
	}, [userStore.signOut]);

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
							userStore.setProfilePicture(image as {data: string});
						}),
				},
				{
					text: "Adicionar foto da galeria",
					onPress: () =>
						ImagePicker.openPicker({includeBase64: true}).then(image => {
							userStore.setProfilePicture(image as {data: string});
						}),
				},
			],
		);
	}, [userStore]);

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
			<Button onPress={logout}>SAIR</Button>
		</Layout>
	);
});

export default Profile;

interface ProfileEditModalProps {
	visible: boolean;
	field: keyof UserStore;
	onClose: () => void;
}

const ProfileEditModal = observer<ProfileEditModalProps>(props => {
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
