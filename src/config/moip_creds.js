import { developConfig, productionConfig } from '../../credenciais-e-configuracoes';
// ############################## ATENÇÃO ##############################
// NUNCA COMITTAR OS SECRETS DO MOIP ###################################
// CUIDADO #############################################################
// ############################## ATENÇÃO ##############################
// ############################## ATENÇÃO ##############################
// ############################## ATENÇÃO ##############################
// ############################## ATENÇÃO ##############################
// ############################## ATENÇÃO ##############################

const moipCredsData = {
  publicKey: developConfig.moipCredsData.publicKey,
  Authorization: developConfig.moipCredsData.Authorization,
  OAuth2: developConfig.moipCredsData.oAuth2MainApp
};

export default moipCredsData;
