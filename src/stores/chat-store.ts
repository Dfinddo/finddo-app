/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/naming-convention */
import {observable, action, runInAction} from "mobx";

import finddoApi, {ChatApiResponse} from "finddo-api";

export interface Message {
	id: string;
	order_id: string;
	sender_id: string;
	receiver_id: string
	is_read: boolean;
	message: string;
}

class ChatStore {
	@observable order_id = "";

	@observable public chat: Message[] = [];

	@observable private page= 1;

	@observable private total= 1;
	
	createMessageFromApiResponse(
		apiResponse: ChatApiResponse,
	): Message {
		const chatStore: Message = {} as Message;

		Object.assign(ChatStore, apiResponse);

		return chatStore;
	}

	@action
	public async fetchChat(order_id: string): Promise<void> {
		try {
			const response = await finddoApi.get(`chats/order`, {
				params: {
					page: 1, 
					order_id,
				},
			});

			// console.log(response.data);
			const chatList: ChatApiResponse[] = response.data.chats;
			const chat = chatList.map(message =>
				this.createMessageFromApiResponse(message),
			);

			runInAction(() => {
				this.chat = chat;
				this.order_id = order_id;
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

			for (let index = 1; index <= this.page; index++) {
				const response = await finddoApi.get(`chats/order`, {
					params: {
						page: index, 
						order_id: this.order_id,
					},
				});

				chatList = [...chatList, ...response.data.chats];	

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
			const response = await finddoApi.get(`chats/order`, {
				params: {
					page: this.page + 1, 
					order_id: this.order_id,
				},
			});
			const chatList: ChatApiResponse[] = response.data.chats;
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
	public saveNewMessage = async (data: Omit<Message, "id" | "is_read">): Promise<void> => {
		try {
			await finddoApi.post("/chats", {data});

			runInAction(() => this.updateChat());
		} catch (error) {
			if (error.response) throw new Error("Invalid chat data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	};
}

export default ChatStore;
