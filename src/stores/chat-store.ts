/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/naming-convention */
import {observable, action, runInAction} from "mobx";

import finddoApi, {ChatApiResponse} from "finddo-api";
import UserStore from "./user-store";
import {createAutomaticMessage, CreateMessageData} from "../utils/automaticMessage";

export interface Message {
	id: string;
	order_id: string;
	receiver_id: string
	is_read: boolean;
	message: string;
	// for_admin: string;
}

class ChatStore {
	@observable order_id = "";

	@observable public chat: Message[] = [];

	@observable private isAdminChat = false;

	@observable private isGlobalChat = false;

	@observable private page= 1;

	@observable private total= 1;
	
	createMessageFromApiResponse(
		apiResponse: ChatApiResponse,
	): Message {
		const chatStore: Message = {} as Message;

		Object.assign(chatStore, apiResponse);

		return chatStore;
	}

	@action
	public async fetchChat(
		order_id: string, 
		isAdminChat: boolean, 
		isGlobalChat= false
	): Promise<void> {
		try {
			const response = !isAdminChat ? await finddoApi.get(`chats/order`, {
				params: {
					page: 1, 
					order_id,
				},
			}) : await finddoApi.get(`chats/order/admin`, {
				params: {
					page: 1, 
					order_id,
					receiver_id: 1,
				},
			});

			const chatList: ChatApiResponse[] = response.data.chats.map(
				(item: {data:{attributes: ChatApiResponse}}) => item.data.attributes
			);

			const chat = chatList ? chatList.map(message =>
				this.createMessageFromApiResponse(message),
			) : [];

			runInAction(() => {
				this.chat = chat;
				this.order_id = order_id;
				this.isAdminChat = isAdminChat;
				this.isGlobalChat = isGlobalChat;
				this.page = response.data.current_page;
				this.total = response.data.total_pages;
			});
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
			if (error.response) throw new Error("Invalid chat request");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	}

	@action
	public async updateChat(): Promise<void> {
		try {
			let chatList: ChatApiResponse[] = [];
			let {total} = this;

			for (let index = 1; index <= this.page + 1; index++) {
				const response = !this.isAdminChat ? await finddoApi.get(`chats/order`, {
					params: {
						page: index, 
						order_id: this.order_id,
					},
				}) : await finddoApi.get(`chats/order/admin`, {
					params: {
						page: index, 
						order_id: this.order_id,
						receiver_id: 1,
					},
				});

				const list: ChatApiResponse[] = response.data.chats.map(
					(item: {data:{attributes: ChatApiResponse}}) => item.data.attributes
				);

				chatList = [...chatList, ...list];	

				if(total !== response.data.total_pages) {
					total = response.data.total_pages;
				}
			}

			const chat = chatList.map(service =>
				this.createMessageFromApiResponse(service),
			);

			runInAction(() => {
				this.chat = chat;
				this.total = total;
			});
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
			if (error.response) throw new Error("Invalid chat request");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	}

	@action
	public async expandChat(): Promise<void> {
		try {
			const response = this.isAdminChat ? await finddoApi.get(`chats/order`, {
				params: {
					page: this.page + 1, 
					order_id: this.order_id,
				},
			}) : await finddoApi.get(`chats/admin/order`, {
				params: {
					page: this.page + 1, 
					order_id: this.order_id,
					receiver_id: 1,
				},
			});
			const chatList: ChatApiResponse[] = response.data.chats.data.attributes;
			const chat = chatList.map(service =>
				this.createMessageFromApiResponse(service),
			);

			runInAction(() => {
				this.chat = chat;
				this.page = response.data.current_page;
				this.total = response.data.total_pages;
			});
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log({error});
			if (error.response) throw new Error("Invalid chat request");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	}

	@action
	public saveNewMessage = async ({receiver_id, ...rest}: Omit<Message, "id" | "is_read">, user: UserStore): Promise<void> => {
		try {
			!this.isGlobalChat ? await finddoApi.post("/chats", {chat: {
				...rest,
				receiver_id: this.isAdminChat ? 1 : receiver_id,
				for_admin: this.isAdminChat ? user.userType : "normal",
			}}) : 
			await finddoApi.post("/chats/admin", {chat: {
				message: rest.message,
				receiver_id: 1,
			}});

			runInAction(() => this.updateChat());
		} catch (error) {
			if (error.response) throw new Error("Invalid chat data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	};

	static sendAutomaticMessageAdm = async (data: CreateMessageData): Promise<void> => {
		try {
			await finddoApi.post("/chats/admin", {chat: {
				order_id: data.order.id,
				message: createAutomaticMessage(data),
				receiver_id:  1,
				for_admin: data.user.userType
			}});

		} catch (error) {
			if (error.response) throw new Error("Invalid chat data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	};
}

export default ChatStore;
