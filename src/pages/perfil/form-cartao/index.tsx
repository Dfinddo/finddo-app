import React, {Component} from "react";
import {
	ImageBackground,
	View,
	Text,
	Modal,
	TouchableOpacity,
	ScrollView,
	SectionList,
	Alert,
	ActivityIndicator,
	Keyboard,
} from "react-native";
import {colors} from "../../../colors";
import TokenService from "../../../services/token-service";
import HeaderFundoTransparente from "../../../components/header-fundo-transparente";
import {StackActions} from "react-navigation";
import moipAPI, {headersOauth2} from "../../../services/moip-api";
import {styles} from "./styles";
import {
	Button,
	Datepicker,
	Divider,
	Input,
	Layout,
	StyleService,
	useStyleSheet,
} from "@ui-kitten/components";
// import { EyeIcon, EyeOffIcon } from './extra/icons';
// import { KeyboardAvoidingView } from './extra/3rd-party';

export default class FormCartaoScreen extends Component {

	public keyboardDidShowListener: any;

	public keyboardDidHideListener: any;

	public setState: any;

	public props: any;

	public creditCard: any;

	static navigationOptions = {
		headerTransparent: true,
		headerTitle: () => <HeaderFundoTransparente />,
	};

	state = {
		tituloForm: "Adicionar Cartão",
		cardData: Card(),
		formInvalid: false,
		formErrors: [],
		isLoading: false,
		isShowingKeyboard: false,
		id: null,
	};

	componentDidMount() {

		this.keyboardDidShowListener = Keyboard.addListener(
			"keyboardDidShow",
			this._keyboardDidShow,
		);
		this.keyboardDidHideListener = Keyboard.addListener(
			"keyboardDidHide",
			this._keyboardDidHide,
		);
		Alert.alert(
			"ATENÇÃO",
			"Preencha os dados rigorosamente da MESMA forma que no seu cartão",
			[{text: "OK", onPress: () => {}}],
		);

	}

	componentWillUnmount() {

		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();

	}

	_keyboardDidShow = () => {

		this.setState({isShowingKeyboard: true});

	};

	_keyboardDidHide = () => {

		this.setState({isShowingKeyboard: false});

	};

	preparaDataParaFormatoWirecard = data => data.split("T")[0];

	atualizarDadosCartao = (chave, valor) => {

		const card = this.state.cardData;

		card.creditCard[chave] = valor;

		this.setState({cardData: card});

	};

	atualizarDadosHolder = (chave, valor) => {

		const card = this.state.cardData;

		card.creditCard.holder[chave] = valor;

		this.setState({cardData: card});

	};

	atualizarDadosHolderDocs = (chave, valor) => {

		const card = this.state.cardData;

		card.creditCard.holder.taxDocument[chave] = valor;

		this.setState({cardData: card});

	};

	atualizarDadosHolderPhone = (chave, valor) => {

		const card = this.state.cardData;

		card.creditCard.holder.phone[chave] = valor;

		this.setState({cardData: card});

	};

	validateCard = () => {

		const numberRegex = /^[0-9]*$/;

		const errosArr = [];

		const expirationMonthErrors = [];
		const expirationYearErrors = [];
		const numberErrors = [];
		const cvcErrors = [];
		const fullnameErrors = [];
		const birthdateErrors = [];
		const cpfErrors = [];
		const areaCodeErrors = [];
		const numberPhoneErrors = [];
		const {creditCard} = this.state.cardData;

		// TODO: Organize this
		/* eslint-disable prettier/prettier */
		if (creditCard.expirationMonth.length === 0) expirationMonthErrors.push("É obrigatório.");
		if (creditCard.expirationMonth.length < 2) expirationMonthErrors.push("Inválido.");
		if (!numberRegex.test(creditCard.expirationMonth)) expirationMonthErrors.push("Apenas números.");

		if (creditCard.expirationYear.length === 0) expirationYearErrors.push("É obrigatório.");
		if (creditCard.expirationYear.length < 2 || creditCard.expirationYear.length === 3) expirationYearErrors.push("Inválido.");
		if (!numberRegex.test(creditCard.expirationYear)) expirationYearErrors.push("Apenas números.");

		if (creditCard.number.length === 0) numberErrors.push("É obrigatório.");
		if (!numberRegex.test(creditCard.number)) numberErrors.push("Apenas números.");

		if (creditCard.cvc.length === 0) cvcErrors.push("É obrigatório.");
		if (!numberRegex.test(creditCard.cvc)) cvcErrors.push("Apenas números.");

		if (creditCard.holder.fullname.length === 0) fullnameErrors.push("É obrigatório.");

		if (creditCard.holder.birthdate.length === 0) birthdateErrors.push("É obrigatório.");

		if (creditCard.holder.taxDocument.number.length === 0) cpfErrors.push("É obrigatório.");

		if (creditCard.holder.phone.areaCode.length !== 2) areaCodeErrors.push("Inválido.");

		if (creditCard.holder.phone.number.length < 8) numberPhoneErrors.push("Inválido.");


		if (expirationMonthErrors.length > 0) errosArr.push({title: "Mês de Expiração", data: expirationMonthErrors});
		if (expirationYearErrors.length > 0) errosArr.push({title: "Ano de Expiração", data: expirationYearErrors});
		if (numberErrors.length > 0) errosArr.push({title: "Número de Cartão", data: numberErrors});
		if (cvcErrors.length > 0) errosArr.push({title: "Código de Segurança", data: cvcErrors});
		if (fullnameErrors.length > 0) errosArr.push({title: "Nome do Titular", data: fullnameErrors});
		if (birthdateErrors.length > 0) errosArr.push({title: "Data de Nascimento do Titular", data: birthdateErrors});
		if (cpfErrors.length > 0) errosArr.push({title: "CPF do Titular", data: cpfErrors});
		if (areaCodeErrors.length > 0) errosArr.push({title: "DDD", data: areaCodeErrors});
		if (numberPhoneErrors.length > 0) errosArr.push({title: "Telefone do Titular", data: numberPhoneErrors});
		/* eslint-enable prettier/prettier */

		if (errosArr.length > 0) {

			this.setState({formErrors: [...errosArr]});
			this.setState({formInvalid: true});

		} else
			this.salvarCartao();

	};

	salvarCartao = async() => {

		try {

			this.setState({isLoading: true});
			const user = TokenService.getInstance().getUser();
			const preparedData = JSON.parse(JSON.stringify(this.state.cardData));

			preparedData.creditCard.holder.birthdate = this.preparaDataParaFormatoWirecard(
				preparedData.creditCard.holder.birthdate,
			);
			const response = await moipAPI.post(
				`/customers/${user.customer_wirecard_id}/fundinginstruments`,
				preparedData,
				{headers: headersOauth2},
			);

			this.setState({isLoading: false, id: response.data.id});

			const popAction = StackActions.pop({
				n: 1,
			});

			this.props.navigation.dispatch(popAction);

		} catch (error) {

			if (error.response) {


				/*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
				Alert.alert(
					"Erro",
					"Verifique os dados e tente novamente",
					[{text: "OK", onPress: () => {}}],
					{cancelable: false},
				);

			} else if (error.request) {


				/*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
				Alert.alert(
					"Falha ao se conectar",
					"Verifique sua conexão e tente novamente",
					[{text: "OK", onPress: () => {}}],
					{cancelable: false},
				);

			} else {

				/* Something happened in setting up the request and triggered an Error */
			}
			this.setState({isLoading: false});

		}

	};

	render() {

		return (
			<ImageBackground
				style={styles.backgroundImageContent}
				source={require("../../../img/Ellipse.png")}>
				<View style={{height: 60}} />
				<ScrollView>
					<Modal
						animationType="slide"
						transparent={true}
						visible={this.state.isLoading}>
						<View style={styles.modalStyle}>
							<View>
								<ActivityIndicator
									size="large"
									color={colors.verdeFinddo}
									animating={true}
								/>
							</View>
						</View>
					</Modal>
					<Modal
						animationType="slide"
						transparent={true}
						visible={this.state.formInvalid}>
						<View style={styles.modalBase}>
							<View style={styles.modalDialog}>
								<View style={styles.modalDialogContent}>
									<Text style={styles.modalErrosTitulo}>Erros:</Text>
									<SectionList
										style={styles.modalErrosSectionList}
										sections={this.state.formErrors}
										keyExtractor={(item, index) => item + index}
										renderItem={({item}) => <Item title={item} />}
										renderSectionHeader={({section: {title}}) =>
											<Text style={styles.modalErrosTituloErro}>{title}</Text>
										}
									/>
									<TouchableOpacity
										style={styles.modalErrosBotaoContinuar}
										onPress={() => this.setState({formInvalid: false})}>
										<Text style={styles.continuarButtonText}>VOLTAR</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</Modal>
					<View style={styles.cadastroForm}>
						<View style={styles.cadastroMainForm}>
							<Text style={styles.fontTitle}>{this.state.tituloForm}</Text>
							<Layout style={styles.form} level="1">
								<Input
									style={styles.input}
									label="Número do Cartão"
									placeholder="1234 3456 5678 7890"
									keyboardType="number-pad"
									maxLength={16}
									value={this.state.cardData.creditCard.number}
									onChangeText={text =>
										this.atualizarDadosCartao("number", text)
									}
								/>
								<View style={styles.middleContainer}>
									<Input
										style={[styles.input, styles.middleInput, {width: 80}]}
										label="Validade(Mês)"
										placeholder="MM"
										maxLength={2}
										keyboardType="number-pad"
										value={this.state.cardData.creditCard.expirationMonth}
										onChangeText={text => {

											this.atualizarDadosCartao("expirationMonth", text);

										}}
									/>
									<Input
										style={[styles.input, styles.middleInput, {width: 80}]}
										label="Validade(Ano)"
										placeholder="AA"
										maxLength={4}
										keyboardType="number-pad"
										value={this.state.cardData.creditCard.expirationYear}
										onChangeText={text => {

											this.atualizarDadosCartao("expirationYear", text);

										}}
									/>
									<Input
										style={[styles.input, styles.middleInput, {width: 96}]}
										label="CVV"
										keyboardType="number-pad"
										maxLength={3}
										placeholder="123"
										value={this.state.cardData.creditCard.cvc}
										onChangeText={text =>
											this.atualizarDadosCartao("cvc", text)
										}
									/>
									{/*
                  TODO: Hide CVV text
                  label="Código de Verificação"
                  secureTextEntry={!cvvVisible}
                  icon={cvvVisible ? 'EyeIcon' : 'EyeOffIcon'}
                  onIconPress={onCVVIconPress}*/}
								</View>
								<Input
									style={styles.input}
									label="Titular"
									placeholder="Nome como aparece no cartão"
									value={this.state.cardData.creditCard.holder.fullname}
									onChangeText={text =>
										this.atualizarDadosHolder("fullname", text)
									}
								/>
								<Datepicker
									style={styles.input}
									label="Data de Nascimento"
									placeholder="dd/mm/aaaa"
									keyboardType={"number-pad"}
									date={this.state.cardData.creditCard.holder.birthdate}
									onSelect={text =>
										this.atualizarDadosHolder("birthdate", text)
									}
									maxLength={10}
								/>
								{/*
                  value={this.state.cardData.creditCard.holder.birthdate}
                  onChangeText={text => this.atualizarDadosHolder('birthdate', text)}*/}
								<Input
									style={styles.input}
									label="CPF"
									onChangeText={text =>
										this.atualizarDadosHolderDocs("number", text)
									}
									placeholder="Apenas números"
									keyboardType={"number-pad"}
									maxLength={11}
									value={
										this.state.cardData.creditCard.holder.taxDocument.number
									}
								/>
								<View style={styles.middleContainer}>
									<Input
										style={[styles.input, {width: 70}]}
										label="DDD"
										placeholder="21"
										keyboardType={"number-pad"}
										maxLength={2}
										onChangeText={text =>
											this.atualizarDadosHolderPhone("areaCode", text)
										}
										value={this.state.cardData.creditCard.holder.phone.areaCode}
									/>
									<Input
										style={[styles.input, {width: 210}]}
										label="Telefone"
										placeholder="Apenas números"
										keyboardType={"number-pad"}
										onChangeText={text =>
											this.atualizarDadosHolderPhone("number", text)
										}
										value={this.state.cardData.creditCard.holder.phone.number}
									/>
								</View>
							</Layout>
						</View>
					</View>
				</ScrollView>
				<BotaoCriar
					isShowingKeyboard={this.state.isShowingKeyboard}
					onPress={() => this.validateCard()}
				/>
			</ImageBackground>
		);

	}

}

function BotaoCriar(props) {

	if (props.isShowingKeyboard === false) {

		return (
			<View style={{justifyContent: "center", alignItems: "center"}}>
				<TouchableOpacity
					style={{
						marginBottom: 10,
						width: 340,
						height: 45,
						borderRadius: 20,
						backgroundColor: colors.verdeFinddo,
						alignItems: "center",
						justifyContent: "center",
					}}
					onPress={props.onPress}>
					<Text
						style={{
							fontSize: 18,
							color: colors.branco,
							textAlign: "center",
						}}>
            SALVAR
					</Text>
				</TouchableOpacity>
			</View>
		);

	}

	return null;

}

function Card() {

	return {
		method: "CREDIT_CARD",
		creditCard: {
			expirationMonth: "",
			expirationYear: "",
			number: "",
			cvc: "",
			holder: {
				fullname: "",
				birthdate: "",
				taxDocument: {
					type: "CPF",
					number: "",
				},
				phone: {
					countryCode: "55",
					areaCode: "",
					number: "",
				},
			},
		},
	};

}

function Item({title}) {

	return (
		<View>
			<Text style={{fontSize: 18}}>
				{"\t"}
				{title}
			</Text>
		</View>
	);

}

Object.assign(
	styles,
	StyleService.create({
		container: {
			flex: 1,
			backgroundColor: "background-basic-color-2",
		},
		form: {
			// flex: 1,
			// paddingHorizontal: 4,
			// paddingVertical: 24,
		},
		input: {
			marginHorizontal: 12,
			marginVertical: 8,
		},
		middleContainer: {
			flexDirection: "row",
		},
		middleInput: {
			width: 128,
		},
		addButton: {
			marginHorizontal: 16,
			marginVertical: 24,
		},
	}),
);
