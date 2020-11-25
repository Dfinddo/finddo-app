/* eslint-disable @typescript-eslint/naming-convention */
import ServiceStore from "stores/service-store";
import UserStore from "stores/user-store";

type Reason = 
  "not_attend" | 
  "cancel" | 
  "accidentally_created" | 
  "problem" | 
  "generic" | 
  "accidentally_associated"

export interface CreateMessageData {
  user: UserStore;
  order: ServiceStore;
  reason: Reason;
}

export const createAutomaticMessage = ({ user,  reason, order}: CreateMessageData): string  => {
    switch (reason) {
      case "not_attend":
        return user.userType === 'user' ? `Profissional nao compareceu: Olá, 
        eu sou o usuário ${user.name} ${user.surname}, e o 
        profissional ${order.professional_order?.name} ${order.professional_order?.surname} 
        não compareceu para o pedido #${order.id}.` : 
        `Olá, eu sou o profissional ${user.name} ${user.surname}, e infelizmente apesar de ter aceitado 
        o pedido #${order.id}, não poderei realiza-lo.`
        ;
      case "generic":
        return `Olá, eu sou o ${user.userType ==="user" ? "usuário" : "profissional"}
         ${user.name} ${user.surname}, e tive 
        problemas com o pedido #${order.id}.`;
      case "accidentally_created":
        return `Olá, eu sou o usuário ${user.name} ${user.surname}, e criei o pedido 
        #${order.id} sem querer, e portanto gostaria de cancela-lo.`;
      case "accidentally_associated":
        return `Olá, eu sou o profissional ${user.name} ${user.surname}, e aceitei o pedido 
        #${order.id} sem querer, e portanto gostaria de cancela-lo.`;
      default: 
        return "";
    }
  };
