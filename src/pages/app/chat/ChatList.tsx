/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-native/no-color-literals */
import React, {useState, useEffect, useCallback} from "react";
import {
	ScrollView,
	StyleSheet,
} from "react-native";
import {
	Text,
	Layout,
	List,
	ListItem,
	Avatar,
	Divider,
} from "@ui-kitten/components";
import { useChatList, useUser} from "hooks";
import {observer} from "mobx-react-lite";
import TaskAwaitIndicator from "components/TaskAwaitIndicator";
import {StackScreenProps} from "@react-navigation/stack";
import {AppDrawerParams} from "src/routes/app";
import { BACKEND_URL_STORAGE } from "config";
import finddoApi from "finddo-api";

type ChatListScreenProps = StackScreenProps<
	AppDrawerParams,
	"ChatList"
>;

const ChatList = observer<ChatListScreenProps>(props => {
	const userStore = useUser();
	const chatListStore = useChatList();

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
    setIsLoading(true);
    if(chatListStore.list.length === 0){
      try {
				chatListStore.fetchChats();
				finddoApi.get(`/chats/${userStore.id}`).then(response => {
					console.log(response.data);
				});
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log({error});
      }
    }
		setIsLoading(false);
	}, [chatListStore, userStore]);

	const handleExpandList = useCallback(async()=>{
		try {
			await chatListStore.updateChats();
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
		}
	}, [chatListStore]);

	function handleSubmit(id: number): void {
		props.navigation.navigate("Chat",{order_id: id});
	}

	return (
		<Layout level="3">
			<ScrollView>
				<TaskAwaitIndicator isAwaiting={isLoading} />
				<Text style={styles.screenTitle} category="h4">Lista de Chats ativos</Text>

				<List
					scrollEnabled
					ItemSeparatorComponent={Divider}
					onEndReached={handleExpandList}
					onEndReachedThreshold={0.2}
					style={styles.listContainer}
          data={chatListStore.list}
					renderItem={({ item, index }: {item: typeof chatListStore.list[0], index: number}) => (
						<ListItem
							key={index}
							style={styles.listItem}
							onPress={()=>{handleSubmit(Number(item.order_id))}}
							title={(props)=><Text {...props} style={styles.title}>
               {item.title}
              </Text>}
							// description={()=><Text style={styles.description}>Classificação: {item.rate} estrelas</Text>}
							accessoryLeft={(props) => (
								<Avatar {...props} style={styles.avatar} source={
					 				{uri: `${BACKEND_URL_STORAGE}${item.receiver_profile_photo}`}	} />
							)}
						/>
					)}
    		/>
			</ScrollView>
		</Layout>
	);
});

export default ChatList;

const styles = StyleSheet.create({
	// backgroundImageContent: {width: "100%", height: "100%"},
	listContainer: {
		alignSelf: "center",
    width:"90%",
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
		fontWeight: "500",
	},
	// description: {
	// 	fontSize: 14,
	// 	fontWeight: "300",
	// 	color: "#666",
	// },
	avatar: {
		width: 56,
		height: 56,
		marginRight: 12,
	},
});
