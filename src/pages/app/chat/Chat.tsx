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
import {StackScreenProps} from "@react-navigation/stack";
import {AppDrawerParams} from "src/routes/app";
import { BACKEND_URL_STORAGE } from "@env";
import { useDispatch, useSelector } from "react-redux";
import { State } from "stores/index";
import { UserState } from "stores/modules/user/types";
import { Chat as IChat, Message } from "stores/modules/chats/types";
import finddoApi, { ChatApiResponse } from "finddo-api";
import { fetchActiveChat } from "stores/modules/chats/actions";

type ProfileScreenProps = StackScreenProps<AppDrawerParams, "Chat">;

const Chat = ((props: ProfileScreenProps): JSX.Element => {
	const { order_id, receiver_id, title, photo=null } = props.route.params;
	const styles = useStyleSheet(themedStyles);
	const dispatch = useDispatch();
	const chatStore = useSelector<State, IChat>(state => state.chats.activeChat);
	const userStore = useSelector<State, UserState>(state => state.user);
	const [loading, setIsLoading] = React.useState(false);
	const [message, setMessage] = React.useState("");

	const getChat = useCallback(async (): Promise<void> => {
		setIsLoading(true);
		const {isAdminChat} = props.route.params;

		try {
			const response = !isAdminChat ? await finddoApi.get(`chats/order`, {
				params: {
					page: 1, 
					order_id: String(order_id),
				},
			}) : await finddoApi.get(`chats/order/admin`, {
				params: {
					page: 1, 
					order_id: String(order_id),
					receiver_id: 1,
				},
			});

			const chat: Message[] = response.data.chats.map(
				(item: {data:{attributes: ChatApiResponse}}) => item.data.attributes
			);

			dispatch(fetchActiveChat({
				messages: chat,
				order_id: String(order_id),
				isAdminChat,
				isGlobalChat: order_id === 170,
				page: response.data.current_page,
				total: response.data.total_pages,
			}));
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
	}, [order_id, props.route.params, dispatch]);

	useEffect(() => void getChat(), [getChat]);

	const onSendButtonPress = async (): Promise<void> => {
		setIsLoading(true);
		try {
			!(order_id === 170) ? await finddoApi.post("/chats", {chat: {
				order_id,
				message,
				receiver_id: chatStore.isAdminChat ? 1 : receiver_id,
				for_admin: chatStore.isAdminChat ? userStore.user_type : "normal",
			}}) : 
			await finddoApi.post("/chats/admin", {chat: {
				message,
				receiver_id: 1,
			}});

			await getChat();
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
			let chat: Message[] = [];
			let {total} = chatStore;

			const page = chatStore.page +1 > total ? chatStore.page : chatStore.page +1; 

			for (let index = 1; index <= page; index++) {
				const response = !chatStore.isAdminChat ? await finddoApi.get(`chats/order`, {
					params: {
						page: index, 
						order_id: chatStore.order_id,
					},
				}) : await finddoApi.get(`chats/order/admin`, {
					params: {
						page: index, 
						order_id: chatStore.order_id,
						receiver_id: 1,
					},
				});

				const list: Message[] = response.data.chats.map(
					(item: {data:{attributes: ChatApiResponse}}) => item.data.attributes
				);

				chat = [...chat, ...list];	

				if(total !== response.data.total_pages) {
					total = response.data.total_pages;
				}
			}

			dispatch(fetchActiveChat({
				messages: chat,
				order_id: String(order_id),
				isAdminChat: chatStore.isAdminChat,
				isGlobalChat: order_id === 170,
				page,
				total,
			}));
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error);
		}
		finally {
			setIsLoading(false);
		}
	}, [chatStore, dispatch, order_id]);

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
				data={chatStore.messages}
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
	const userStoreID = useSelector<State, string>(state => state.user.id);
	const {message} = props;

	return (
		<View
			style={[
				Number(message.receiver_id) === Number(userStoreID) ? 
				styles.messageRowOut : styles.messageRowIn,
				styles.messageRow,
			]}
		>
			<View
				style={[
					Number(message.receiver_id) === Number(userStoreID)
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
		backgroundColor: "#666",
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
