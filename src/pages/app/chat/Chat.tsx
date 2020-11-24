/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, useEffect } from "react";
import {Alert, View} from "react-native";
import {
	Button,
	Input,
	List,
	Layout,
	Icon,
	StyleService,
	Text,
	useStyleSheet,
	TopNavigation,
	TopNavigationAction,
	Avatar,
} from "@ui-kitten/components";
import {observer} from "mobx-react-lite";
import {StackScreenProps} from "@react-navigation/stack";
import {AppDrawerParams} from "src/routes/app";
import { useChat, useServiceList, useUser } from "hooks";
import ServiceStore from "stores/service-store";
import { Message } from "stores/chat-store";
import { BACKEND_URL_STORAGE } from "config";
import finddoApi from "finddo-api";

type ProfileScreenProps = StackScreenProps<AppDrawerParams, "Chat">;

const Chat = observer<ProfileScreenProps>(props => {
	const { order_id, title, photo=null } = props.route.params;
	const styles = useStyleSheet(themedStyles);
	const chatStore = useChat();
	const userStore = useUser();
	const serviceListStore = useServiceList();
	const [loading, setIsLoading] = React.useState(false);
	const [message, setMessage] = React.useState("");

	const getChat = useCallback(async (): Promise<void> => {
		setIsLoading(true);

		try {
			await chatStore.fetchChat(String(order_id), props.route.params.isAdminChat);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error);
			if (error.response) {
				Alert.alert("Erro", "Verifique sua conexão e tente novamente");
			} else if (error.request) {
				Alert.alert(
					"Falha ao se conectar",
					"Verifique sua conexão e tente novamente",
				);
			} else throw error;
		} finally {
			setIsLoading(false);
		}
	}, [chatStore, order_id, props.route.params.isAdminChat]);

	useEffect(() => void getChat(), [getChat]);

	const onSendButtonPress = async (): Promise<void> => {
		setIsLoading(true);
		try {
			let order = serviceListStore.list.find(element => element.id === order_id);

			if(userStore.userType === "professional"){
				const response = await finddoApi.get(`orders/${order_id}`);

				order = ServiceStore.createFromApiResponse(response.data);
			}

			if(!order || !order.userID || !order.professional_order?.id) {
				throw new Error("Pedido não localizado");
			}

			await chatStore.saveNewMessage({
				order_id: String(order_id), 
				receiver_id: userStore.id !== String(order.userID) ? 
					String(order.userID) : 
					String(order.professional_order.id),
				message,
			}, userStore);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error);
		}
		finally {
			setIsLoading(false);
			setMessage("");
		}
	};

	const handleUpdateChat = useCallback(async ()=>{
		setIsLoading(true);
		try {
			await chatStore.updateChat();
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error);
		}
		finally {
			setIsLoading(false);
		}
	}, [chatStore]);

	return (
		<Layout style={styles.container}>
			<TopNavigation
				title={props => (
					<View style={styles.headerTitleContainer}>
						<Avatar 
							source={
								photo ? {	uri:`${BACKEND_URL_STORAGE}${photo}` } :
									require("assets/sem-foto.png")
							}
						/>
						<Text {...props} style={styles.headerTitle}>
							{title}
						</Text>
					</View>
				)}
				accessoryLeft={() => (
					<TopNavigationAction
						icon={props => <Icon {...props} name="arrow-back" />}
						onPress={props.navigation.goBack}
					/>
				)}
			/>
			<List
				data={chatStore.chat}
				onEndReached={handleUpdateChat}
				inverted
				refreshing={loading}
				onEndReachedThreshold={0.2}
				renderItem={({item}) => <ChatMessage message={item} />}
			/>
			<Layout style={styles.messageInputContainer}>
				<Input
					style={styles.messageInput}
					placeholder="Message..."
					value={message}
					onChangeText={setMessage}
				/>
				<Button
					style={styles.sendButton}
					appearance="ghost"
					disabled={!message.length}
					onPress={onSendButtonPress}
					accessoryLeft={props => (
						<Icon {...props} name="paper-plane-outline" />
					)}
				/>
			</Layout>
		</Layout>
	);
});

export default Chat;

interface ChatMessageProps {
	message: Message;
}

const ChatMessage = (props: ChatMessageProps): React.ReactElement => {
	const styles = useStyleSheet(themedStyles);
	const userStore = useUser();
	const {message} = props;

	return (
		<View
			style={[
				Number(message.receiver_id) === Number(userStore.id) ? 
				styles.messageRowOut : styles.messageRowIn,
				styles.messageRow,
			]}
		>
			<View
				style={[
					Number(message.receiver_id) === Number(userStore.id)
						? styles.messageContentOut
						: styles.messageContentIn,
					styles.messageContent,
				]}
			>
				<Text style={styles.messageText}>{message.message}</Text>
			</View>
		</View>
	);
};

const themedStyles = StyleService.create({
	container: {
		flex: 1,
	},
	headerTitleContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
	},
	headerTitle: {paddingHorizontal: 16},
	messageListContainer: {
		flex: 1,
	},
	messageRow: {width: "100%", padding: 10},
	messageRowIn: {flexDirection: "row-reverse"},
	messageRowOut: {flexDirection: "row"},
	messageContent: {
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 8,
		maxWidth: "50%",
	},
	messageContentIn: {
		alignSelf: "center",
		backgroundColor: "color-info-500",
	},
	messageContentOut: {
		backgroundColor: "color-primary-default",
	},
	messageText: {
		color: "white",
	},
	messageInputContainer: {
		flexDirection: "row",
		paddingHorizontal: 12,
		paddingVertical: 15,
		paddingTop: 17,
		alignItems: "center",
	},
	messageInput: {
		flex: 1,
		marginRight: 8,
		marginBottom: 0,
		alignSelf: "center",
	},
	sendButton: {width: 42, height: 30, marginBottom: 4},
});
