import React from "react";
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
import {observer} from "mobx-react-lite";
import {StackScreenProps} from "@react-navigation/stack";
import {AppDrawerParams} from "src/routes/app";

type ProfileScreenProps = StackScreenProps<AppDrawerParams, "Chat">;

const loadedMessages = [
	"Sent Message",
	"Received Message 1",
	"Received Message 2",
].map((message, i) => ({
	content: message,
	timestamp: "",
	writenByOther: !i,
}));

interface Message {
	content: string;
	timestamp: "string";
	writenByOther: boolean;
}

const Chat = observer<ProfileScreenProps>(props => {
	const styles = useStyleSheet(themedStyles);
	const [messages, setMessages] = React.useState(loadedMessages);
	const [message, setMessage] = React.useState("");
	const onSendButtonPress = (): void => {
		setMessages(oldMessages =>
			oldMessages.concat({
				content: message,
				timestamp: Date(),
				writenByOther: false,
			}),
		);
		setMessage("");
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
				data={messages}
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
	const {message} = props;

	return (
		<View
			style={[
				message.writenByOther ? styles.messageRowOut : styles.messageRowIn,
				styles.messageRow,
			]}
		>
			<View
				style={[
					message.writenByOther
						? styles.messageContentOut
						: styles.messageContentIn,
					styles.messageContent,
				]}
			>
				<Text>{message.content}</Text>
			</View>
		</View>
	);
};
