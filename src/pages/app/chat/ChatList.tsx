import React, {useState, useEffect, useCallback} from "react";
import {
	Alert,
	StyleSheet,
	View,
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
	Icon,
} from "@ui-kitten/components";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {StackScreenProps} from "@react-navigation/stack";
import {AppDrawerParams} from "src/routes/app";
import { BACKEND_URL_STORAGE } from "@env";
import { ChatListTypes, ChatList as IChatList } from "stores/modules/chats/types";
import { useDispatch, useSelector } from "react-redux";
import { State } from "stores/index";
import finddoApi, { ConversationApiResponse } from "finddo-api";
import { fetchChatList, updateChatList } from "stores/modules/chats/actions";

type ChatListScreenProps = StackScreenProps<
	AppDrawerParams,
	"ChatList"
>;

const ChatList = ((props: ChatListScreenProps): JSX.Element => {
	const dispatch = useDispatch();
	const chatListStore = useSelector<State, ChatListTypes>(state => 
		state.chats.chatLists
	);

	const [index, setIndex] = useState(0);

	const [isLoading, setIsLoading] = useState(false);

	const getChats = useCallback(async (): Promise<void> => {
		setIsLoading(true);

		try {
			const response = await finddoApi.get(`/chats/list`, {
        params: {
          page: 1,
        },
			});

			const responseAdm = await finddoApi.get(`/chats/list/admin`, {
        params: {
          page: 1,
        },
			});
			
			dispatch(fetchChatList({
				default:{
					list: response.data.list ?? [],
					page: response.data.page ?? 1,
					totalPages: response.data.total ?? 1,
				},
				admin:{
					list: responseAdm.data.list ?? [],
					page: responseAdm.data.page ?? 1,
					totalPages: responseAdm.data.total ?? 1,
				}
			}));

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
	}, [dispatch]);

	useEffect(() => void getChats(), [getChats]);

	const handleExpandList = useCallback(async()=>{
		const isValid = index === 1 ? chatListStore.admin.page + 1 > chatListStore.admin.totalPages :
		chatListStore.default.page + 1 > chatListStore.default.totalPages;
		
		if(isValid) {
      return;
		}
		
		try {
			const response = !index ? await finddoApi.get(`/chats/list`, {
        params: {
          page: chatListStore.default.page + 1,
        },
			}) : await finddoApi.get(`/chats/list/admin`, {
        params: {
          page: chatListStore.admin.page + 1,
        },
			});

			const chats: ConversationApiResponse[] = response.data.list;

			const selected = index === 1 ? chatListStore.admin.list :
			 chatListStore.default.list;
			
			dispatch(updateChatList({
				list: [...selected, ...chats],
				page: response.data.page,
				totalPages: response.data.total,
			}, index === 1));
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
		}
	}, [dispatch, chatListStore, index]);

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
			isAdminChat: index === 1,
		});
	};

	const getChatListView = (chatList: IChatList): JSX.Element => (
		<List
			scrollEnabled
			ItemSeparatorComponent={Divider}
			onEndReached={handleExpandList}
			onEndReachedThreshold={0.2}
			style={styles.listContainer}
			data={chatList.list}
			ListEmptyComponent={
				<>
				{!isLoading &&
				<View style={styles.emptyList}>
					<Icon
						style={styles.iconAlert}
						fill="#8F9BB3"
						name="alert-circle-outline"
					/>
					<Text style={styles.emptyListText}>
						Ainda não possui nenhum serviço ativo
					</Text>
				</View>}
				</>
			}
			renderItem={({ item, index }: {item: ConversationApiResponse, index: number}) => (<>
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
						{chatListStore.default && getChatListView(chatListStore.default)}
					</Tab>
					<Tab title='Suporte'>
						{chatListStore.admin && getChatListView(chatListStore.admin)}
					</Tab>
				</TabView>
			</Layout>
	);
});

export default ChatList;

const styles = StyleSheet.create({
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
	avatar: {
		width: 56,
		height: 56,
		marginRight: 12,
	},
	tabBar: {
		height: 48,
	},
	iconAlert: {width: 64, height: 64, marginTop: 32},
	emptyList: {
		flex: 1,
		height: "65%",
		width: "100%",
		alignItems: "center",
		justifyContent: "space-around",
	},
	emptyListText: {
		width: "75%",
		fontSize: 24,
		color: "#8F9BB3",
		textAlign: "center",
		marginBottom: "30%",
		marginTop:32,
	},
});
