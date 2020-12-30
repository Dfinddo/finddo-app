import React, { useEffect } from "react";
import {View} from "react-native";
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
import finddoApi from "finddo-api";
import { fetchActiveChat, updateActiveChat } from "stores/modules/chats/actions";
import { myFirebase } from "src/services/firebase";

type ProfileScreenProps = StackScreenProps<AppDrawerParams, "Chat">;

const Chat = ((props: ProfileScreenProps): JSX.Element => {
	const { order_id, isAdminChat, receiver_id, title, photo=null } = props.route.params;
	const styles = useStyleSheet(themedStyles);
	const dispatch = useDispatch();
	const chatStore = useSelector<State, IChat>(state => state.chats.activeChat);
	const userStore = useSelector<State, UserState>(state => state.user);
	const [loading, setIsLoading] = React.useState(false);
	const [message, setMessage] = React.useState("");

	useEffect(() => {
		dispatch(fetchActiveChat({order_id: String(order_id), isAdminChat}));
		myFirebase.database().ref(`/chats/${order_id}/${isAdminChat ? "admin" : "common"}`)
		.limitToFirst(500)
		.orderByKey()
		.on('value', snapshot => {
			if(snapshot.val()) dispatch(updateActiveChat({
				messages: Object.keys(snapshot.val()).map(key => 
					({...snapshot.val()[key]})).reverse() as Message[],
				order_id: String(order_id),
				isAdminChat,
				isGlobalChat: order_id === 170,
				page:1,
				total:1,
			}));
		})
	},[dispatch, order_id, isAdminChat]);

	const onSendButtonPress = async (): Promise<void> => {
		setIsLoading(true);
		try {
			const response = !(order_id === 170) ? await finddoApi.post("/chats", {chat: {
				order_id,
				message,
				receiver_id: chatStore.isAdminChat ? 1 : receiver_id,
				for_admin: chatStore.isAdminChat ? userStore.user_type : "normal",
			}}) : 
			await finddoApi.post("/chats/admin", {chat: {
				message,
				receiver_id: 1,
			}});

			await myFirebase.database().ref(
				`/chats/${order_id}/${chatStore.isAdminChat ? "admin" : "common"}`
				).push(response.data);
				
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error);
		}
		finally {
			setIsLoading(false);
			setMessage("");
		}
	};

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
				inverted
				refreshing={loading}
				onEndReachedThreshold={0.2}
				renderItem={({item}) =>  <ChatMessage message={item} />}
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
