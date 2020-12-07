/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable class-methods-use-this */
import { observable, action, runInAction, makeObservable } from "mobx";
// import CardStore from "stores/card-store";
import finddoApi, {ConversationApiResponse} from "finddo-api";

class ChatListStore {
    @observable
	public list: ConversationApiResponse[] = [];

    @observable
	public listAdmConversation: ConversationApiResponse[] = [];

    @observable
  public isAdminChat = false;

    @observable
      private page = 1;

    @observable
      private totalPages = 1;

    constructor() {
        makeObservable<ChatListStore, "page" | "totalPages">(this);
    }

    @action
	public async fetchChats(): Promise<void> {
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
			
			const chats: ConversationApiResponse[] = response.data.list;
			const chatsAdm: ConversationApiResponse[] = responseAdm.data.list;

			runInAction(() => {
				this.list = chats;
				this.listAdmConversation = chatsAdm;
        this.page = response.data.page;
        this.totalPages = response.data.total;
      });
		} catch (error) {
			if (error.response) throw new Error("Invalid card data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	}

    @action
	public async updateChats(): Promise<void> {
    if(this.page + 1 > this.totalPages) {
      return;
    }

		try {
			const response = !this.isAdminChat ? await finddoApi.get(`/chats/list`, {
        params: {
          page: this.page + 1,
        },
			}) : await finddoApi.get(`/chats/list/admin`, {
        params: {
          page: this.page + 1,
        },
			});

      const chats: ConversationApiResponse[] = response.data.list;

      runInAction(() => {
        this.list = [...this.list, ...chats];
        this.page = response.data.page;
        this.totalPages = response.data.total;
      });
		} catch (error) {
			if (error.response) throw new Error("Invalid card data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	}
}

export default ChatListStore;
