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
  publicKey: productionConfig.moipCredsData.publicKey,
  Authorization: productionConfig.moipCredsData.Authorization,
  OAuth2: productionConfig.moipCredsData.oAuth2MainApp
};

export default moipCredsData;
