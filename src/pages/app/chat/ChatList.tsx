/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-native/no-color-literals */
import React, {useState, useEffect, useCallback} from "react";
import {
	Alert,
	StyleSheet,
} from "react-native";
import {
	Text,
	Layout,
	List,
	ListItem,
	Avatar,
	Divider,
	Tab,
	TabView,
} from "@ui-kitten/components";
import { useChatList } from "hooks";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {StackScreenProps} from "@react-navigation/stack";
import {AppDrawerParams} from "src/routes/app";
import { BACKEND_URL_STORAGE } from "@env";

type ChatListScreenProps = StackScreenProps<
	AppDrawerParams,
	"ChatList"
>;

const ChatList = ((props: ChatListScreenProps): JSX.Element => {
	const chatListStore = useChatList();
	const [index, setIndex] = useState(0);

	const [isLoading, setIsLoading] = useState(false);

	const getChats = useCallback(async (): Promise<void> => {
		setIsLoading(true);

		try {
			await chatListStore.fetchChats();

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
	}, [chatListStore]);

	useEffect(() => void getChats(), [getChats]);

	const handleExpandList = useCallback(async()=>{
		try {
			await chatListStore.updateChats();
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
		}
	}, [chatListStore]);

	function handleSubmit (data: {
		id: number, 
		another_user_id: number,
		title: string, 
		photo: string|null,
	}): void {
		props.navigation.navigate("Chat",{
			order_id: data.id, 
			receiver_id: data.another_user_id,
			title: data.title, 
			photo: data.photo, 
			isAdminChat: chatListStore.isAdminChat,
		});
	};

	const getChatListView = (chatList: typeof chatListStore.list): JSX.Element => (
		<List
			scrollEnabled
			ItemSeparatorComponent={Divider}
			onEndReached={handleExpandList}
			onEndReachedThreshold={0.2}
			style={styles.listContainer}
      data={chatList}
			renderItem={({ item, index }: {item: typeof chatListStore.list[0], index: number}) => (<>
				{ item &&
						<ListItem
							key={index}
							style={styles.listItem}
							onPress={() => {
							handleSubmit({
								id: item.order_id, 
								another_user_id: item.another_user_id,
								title: item.title, 
								photo: item.receiver_profile_photo ? item.receiver_profile_photo.photo : null,
								})
							}}
							title={(props)=><Text {...props} style={styles.title}>
								{item.title}
							</Text>}
							// description={()=><Text style={styles.description}>Classificação: {item.rate} estrelas</Text>}
							accessoryLeft={(props) => (
								<Avatar {...props} style={styles.avatar} source={
									item.receiver_profile_photo ? 
									{
										uri:`${BACKEND_URL_STORAGE}${item.receiver_profile_photo.photo}`
									} : require("assets/sem-foto.png")
								}/>
								)}
						/>
				}
			</>)}
    />
	);

	return (
		<Layout level="3">
				<TaskAwaitIndicator isAwaiting={isLoading} />
				<Text style={styles.screenTitle} category="h4">Lista de Chats ativos</Text>

				<TabView
					tabBarStyle={styles.tabBar}
					selectedIndex={index}
					onSelect={index => setIndex(index)}>
					<Tab title='Serviços'>
						{getChatListView(chatListStore.list)}
					</Tab>
					<Tab title='Suporte'>
						{getChatListView(chatListStore.listAdmConversation)}
					</Tab>
				</TabView>
			</Layout>
	);
});

export default ChatList;

const styles = StyleSheet.create({
	// backgroundImageContent: {width: "100%", height: "100%"},
	listContainer: {
		alignSelf: "center",
		width:"90%",
		backgroundColor: "transparent",
		marginTop: 8,
  },
	listItem: {
		height: 80,
		margin: 8,
		borderRadius: 8,
	},
	screenTitle: {
		margin: 24,
	},
	title: {
		fontSize: 20,
		fontWeight: "700",
	},
	// description: {
	// 	fontSize: 14,
	// 	fontWeight: "300",
	// 	color: "#d1c4c4",
	// },
	avatar: {
		width: 56,
		height: 56,
		marginRight: 12,
	},
	tabBar: {
		height: 48,
	},
});
