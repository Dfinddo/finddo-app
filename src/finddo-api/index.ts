import axios from "axios";
import {BACKEND_URL} from "config/credentials";

const finddoApi = axios.create({
	baseURL: BACKEND_URL,
});

export default finddoApi;

export type ServiceStatus =
	| "analise"
	| "agendando_visita"
	| "a_caminho"
	| "em_servico"
	| "finalizado"
	| "cancelado";

/* eslint-disable @typescript-eslint/naming-convention */

export const serviceStatusDescription = {
	"": "Todos os status",
	"analise": "Pedido em Análise",
	"agendando_visita": "Agendando Visita",
	"a_caminho": "Profissional à Caminho",
	"em_servico": "Serviço em Execução",
	"finalizado": "Concluído",
	"cancelado": "Cancelado",
} as const;

export const serviceCategories = {
	1: {
		name: "Hidráulica",
		imageUrl: require("assets/jacek-dylag-unsplash.png"),
	},
	2: {
		name: "Elétrica",
		imageUrl: require("assets/eletrica.png"),
	},
	3: {name: "Pintura", imageUrl: require("assets/pintura.png")},
	4: {
		name: "Ar condicionado",
		imageUrl: require("assets/ar-condicionado.png"),
	},
	5: {
		name: "Instalações",
		imageUrl: require("assets/instalacao.png"),
	},
	6: {
		name: "Pequenas reformas",
		imageUrl: require("assets/peq-reforma.png"),
	},
	7: {
		name: "Consertos em geral",
		imageUrl: require("assets/consertos.png"),
	},
} as const;

interface UserApiResponse {
	bairro: string;
	cep: string;
	cidade: string;
	complemento: string;
	cpf: string;
	estado: string;
	numero: string;
	rua: string;

	activated: boolean;
	allow_password_change: boolean;
	birthdate: string;
	cellphone: string;
	created_at: string;
	customer_wirecard_id: string;
	email: string;
	id: number;
	id_wirecard_account: null;
	image: null;
	is_new_wire_account: boolean;
	mothers_name: string;
	name: string;
	nickname: null;
	own_id_wirecard: string;
	player_ids: string[];
	provider: string;
	rate: string;
	refresh_token_wirecard_account: null;
	set_account: string;
	surname: string;
	telephone: null;
	token_wirecard_account: null;
	uid: string;
	updated_at: string;
	user_type: string;
}

interface AddressApiResponse {
	cep: string;
	complement: string;
	district: string;
	id: number;
	name: string;
	number: string;
	selected: boolean;
	street: string;
}

interface ServiceApiResponse {
	address: AddressApiResponse;
	budget: null;
	category: {id: keyof typeof serviceCategories | null; name: string};
	description: string;
	end_order: string;
	hora_fim: string;
	hora_inicio: string;
	id: number;
	images: [];
	order_status: ServiceStatus;
	order_wirecard_id: null;
	order_wirecard_own_id: null;
	paid: false;
	payment_wirecard_id: null;
	price: 0;
	professional_order: UserApiResponse;
	professional_photo: string;
	rate: string;
	start_order: string;
	urgency: "urgent" | "not urgent";
	user: UserApiResponse;
	user_photo: string;
	user_rate: string;
}

/* eslint-enable @typescript-eslint/naming-convention */

export type {UserApiResponse, AddressApiResponse, ServiceApiResponse};
