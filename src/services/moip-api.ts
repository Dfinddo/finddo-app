import axios from "axios";
import moipCredsData from "../config/moip_creds";
import {ambienteASerConstruido} from "../../credenciais-e-configuracoes";

export const headersOauth2 = {};
headersOauth2["Content-Type"] = "application/json";
headersOauth2.Authorization = moipCredsData.OAuth2;

const moipAPI = axios.create({
	baseURL: ambienteASerConstruido.moipUrl,
});

export default moipAPI;
