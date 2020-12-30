import finddoApi from "finddo-api";
import { Service } from "stores/modules/services/types";
import { UserState } from "stores/modules/user/types";

type Reason = 
  "not_attend" | 
  "cancel" | 
  "accidentally_created" | 
  "problem" | 
  "generic" | 
  "cant_previous" |
  "renegotiate" |
  "accidentally_associated"

export interface CreateMessageData {
  user: UserState;
  order: Service;
  reason: Reason;
}

export const createAutomaticMessage = ({ user,  reason, order}: CreateMessageData): string  => {
    switch (reason) {
      case "not_attend":
        return user.user_type === 'user' ? `Olá, 
        eu sou o usuário: ${user.name} ${user.surname}, e o 
        profissional ${order.professional_order?.name} ${order.professional_order?.surname} 
        não compareceu para o pedido #${order.id}.` : 
        `Olá, eu sou o profissional: ${user.name} ${user.surname}, e infelizmente apesar de ter aceitado 
        o pedido #${order.id}, não poderei realiza-lo.`
        ;
      case "generic":
        return `Olá, eu sou o ${user.user_type ==="user" ? "usuário" : "profissional"}
         ${user.name} ${user.surname}, e tive 
        problemas com o pedido #${order.id}.`;
      case "renegotiate":
        return `Olá, eu sou o ${user.user_type ==="user" ? "usuário" : "profissional"}
        ${user.name} ${user.surname}, e gostaria de renegociar o pedido #${order.id}.`;
      case "accidentally_created":
        return `Olá, eu sou o usuário: ${user.name} ${user.surname}, e criei o pedido 
        #${order.id} sem querer, e portanto gostaria de cancela-lo.`;
      case "accidentally_associated":
        return `Olá, eu sou o profissional: ${user.name} ${user.surname}, e aceitei o pedido 
        #${order.id} sem querer, e portanto gostaria de cancela-lo.`;
      case "cant_previous":
        return `Olá, eu sou o profissional: ${user.name} ${user.surname}, e gostaria de aceitar pedido 
        #${order.id}, porém o tipo de orçamento não tem como ser calculado previamente.`;
      default: 
        return "";
    }
  };

  export async function sendAutomaticMessage(
    data: CreateMessageData,
    isAdminChat?: boolean
  ): Promise<void> {
    // eslint-disable-next-line no-nested-ternary
    const receiver_id = isAdminChat ? 1 : (data.user.user_type === "user") ? 
    data.order.professional_order?.id : data.order.userID;

		try {
			await finddoApi.post("/chats", {chat: {
        order_id: data.order.id,
        message: createAutomaticMessage(data),
        receiver_id,
        for_admin: isAdminChat ? data.user.user_type :"normal",
      }});

		} catch (error) {
			if (error.response) throw new Error("Invalid chat data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	};

  export async function sendAutomaticMessageAdm(data: CreateMessageData): Promise<void> {
		try {
			await finddoApi.post("/chats/admin", {chat: {
				order_id: data.order.id,
				message: createAutomaticMessage(data),
				receiver_id:  1,
				for_admin: data.user.user_type
			}});

		} catch (error) {
			if (error.response) throw new Error("Invalid chat data");
			else if (error.request) throw new Error("Connection error");
			else throw error;
		}
	};
