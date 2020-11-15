/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, useEffect } from "react";
import {Alert, RefreshControl, View} from "react-native";
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
	useTheme,
} from "@ui-kitten/components";
import {observer} from "mobx-react-lite";
import {StackScreenProps} from "@react-navigation/stack";
import {AppDrawerParams} from "src/routes/app";
import { useChat, useServiceList, useUser } from "hooks";
import { Message } from "stores/chat-store";

type ProfileScreenProps = StackScreenProps<AppDrawerParams, "Chat">;

const Chat = observer<ProfileScreenProps>(props => {
	const { order_id } = props.route.params;
	const styles = useStyleSheet(themedStyles);
	const chatStore = useChat();
	const userStore = useUser();
	const serviceListStore = useServiceList();
	const [loading, setIsLoading] = React.useState(false);
	const [message, setMessage] = React.useState("");
	const theme = useTheme();

	const getChat = useCallback(async (): Promise<void> => {
		setIsLoading(true);

		try {
			await chatStore.fetchChat(String(order_id));
		} catch (error) {
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
	}, [chatStore, order_id]);

	useEffect(() => void getChat(), [getChat]);

	const onSendButtonPress = async (): Promise<void> => {
		setIsLoading(true);
		try {
			const order = serviceListStore.list.find(element => element.id === order_id);

			if(!order || !order.userID || !order.professional_order?.id) {
				throw new Error("Pedido não localizado");
			}

			await chatStore.saveNewMessage({
				order_id: String(order_id), 
				sender_id: userStore.id,
				receiver_id: userStore.id !== String(order.userID) ? 
					String(order.userID) : 
					String(order.professional_order?.id),
				message,
			});
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error);
		}
		finally {
			setIsLoading(false);
		}
	};

	return (
		<Layout style={styles.container}>
			<TopNavigation
				title={props => (
					<View style={styles.headerTitleContainer}>
						<Avatar source={require("assets/sem-foto.png")} />
						<Text {...props} style={styles.headerTitle}>
							Ful Lano
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
				onRefresh={chatStore.expandChat}
				onEndReached={chatStore.updateChat}
				onEndReachedThreshold={0.2}
				refreshControl={
					<RefreshControl
						colors={[theme["color-primary-active"]]}
						refreshing={loading}
						onRefresh={getChat}
					/>
				}
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
	},
	messageContentIn: {
		alignSelf: "center",
		backgroundColor: "color-basic-600",
	},
	messageContentOut: {
		backgroundColor: "color-primary-default",
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
				message.sender_id !== userStore.id ? styles.messageRowOut : styles.messageRowIn,
				styles.messageRow,
			]}
		>
			<View
				style={[
					message.sender_id !== userStore.id
						? styles.messageContentOut
						: styles.messageContentIn,
					styles.messageContent,
				]}
			>
				<Text>{message.message}</Text>
			</View>
		</View>
	);
};
