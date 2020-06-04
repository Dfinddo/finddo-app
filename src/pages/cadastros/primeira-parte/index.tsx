import React, {Component} from "react";
import {
	ImageBackground, View,
	Text, TextInput,
	Modal,
	TouchableOpacity, ScrollView,
	SectionList, Alert,
	ActivityIndicator,
} from "react-native";
import {colors} from "../../../colors";
import HeaderFundoTransparente from "../../../components/header-fundo-transparente";
import backendRails from "../../../services/backend-rails-api";
import {styles} from "./styles";

export default class PrimeiraParte extends Component {

	public props: any;

	public setState: any;

	public navigation: any;

	static navigationOptions = {
		headerTransparent: true,
		headerTitle: () => <HeaderFundoTransparente />,
		headerBackTitle: "Voltar",
	};

	state = {
		name: "",
		surname: "",
		mothers_name: "",
		email: "",
		cellphone: "",
		cpf: "",
		user_type: "user",
		birthdate: "",
		formInvalid: false,
		formErrors: [],
		isLoading: false,
	};

	componentDidMount() {

		const {navigation} = this.props;
		const user_type = navigation.getParam("tipoCliente", "não há tipo");

		if (user_type !== "não há tipo")
			this.setState({user_type});

	}

	updateBirthdate = (text = "") => {

		if (text.length === 5 || text.length === 2)
			return text;


		const dataFormatada = [];
		const textoASerFormatado = text.replace(/\//gi, "");

		try {

			for (let i = 0; i < textoASerFormatado.length; i++) {

				if (i !== 1 && i !== 3)
					dataFormatada.push(textoASerFormatado[i]);
				else {

					dataFormatada.push(textoASerFormatado[i]);
					dataFormatada.push("/");

				}

			}

			return dataFormatada.join("");

		} catch {

			return "";

		}

	}

	validateFields = () => {

		const numberRegex = /^[0-9]*$/;
		const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

		const errosArr = [];

		const nameErrors = [];
		const surnameErrors = [];
		const mothersNameErrors = [];
		const emailErrors = [];
		const telErrors = [];
		const cpfErrors = [];

		if (this.state.name.length === 0)
			nameErrors.push("É obrigatório.");
		else if (this.state.name.length > 70)
			nameErrors.push("Tamanho máximo 70.");


		if (this.state.surname.length === 0)
			surnameErrors.push("É obrigatório.");
		else if (this.state.name.length > 255)
			surnameErrors.push("Tamanho máximo 255.");


		if (this.state.user_type === "professional") {

			if (this.state.mothers_name.length === 0)
				mothersNameErrors.push("É obrigatório.");
			else if (this.state.name.length > 255)
				mothersNameErrors.push("Tamanho máximo 255.");

		}

		if (this.state.email.length === 0)
			emailErrors.push("É obrigatório.");
		else if (this.state.email.length > 128)
			emailErrors.push("Tamanho máximo 128.");
		else if (!emailRegex.test(this.state.email))
			emailErrors.push("Email inválido.");


		if (this.state.cellphone.length === 0)
			telErrors.push("É obrigatório.");
		else if (
			this.state.cellphone.length < 10 ||
      this.state.cellphone.length > 15 ||
      !numberRegex.test(this.state.cellphone)) {

			telErrors.push("Número inválido.");
			telErrors.push("Favor inserir número com DDD.");

		}

		if (
			this.state.cpf.length !== 11 ||
      !numberRegex.test(this.state.cpf))
			cpfErrors.push("CPF inválido.");


		if (nameErrors.length > 0)
			errosArr.push({title: "Nome", data: nameErrors});

		if (surnameErrors.length > 0)
			errosArr.push({title: "Sobrenome", data: surnameErrors});

		if (emailErrors.length > 0)
			errosArr.push({title: "Email", data: emailErrors});

		if (telErrors.length > 0)
			errosArr.push({title: "Telefone Celular", data: telErrors});

		if (cpfErrors.length > 0)
			errosArr.push({title: "CPF", data: cpfErrors});


		if (errosArr.length > 0) {

			this.setState({formErrors: [...errosArr]});
			this.setState({formInvalid: true});

		} else {

			this.setState({isLoading: true}, () => {

				backendRails.get(`/users?email=${this.state.email}&cellphone=${this.state.cellphone}&cpf=${this.state.cpf}`)
					.then(_ => {

						this.setState({isLoading: false}, () => {

							this.props.navigation.navigate("ParteDois", this.state);

						});

					})
					.catch(err => {

						if (err.response && err.response.status === 403) {

							Alert.alert(
								"Erro",
								err.response.data.error,
								[{text: "OK", onPress: () => { }}],
							);

						} else {

							Alert.alert(
								"Erro",
								"Problema ao prosseguir com o cadastro, aguarde um instante e tente novamente."
									[{text: "OK", onPress: () => { }}],
							);

						}
						this.setState({isLoading: false});

					});

			});

		}

	};

	render() {

		return (
			<ImageBackground
				style={styles.backgroundImageContent}
				source={require("../../../img/Ellipse.png")}>
				<ScrollView>
					<Modal
						animationType="slide"
						transparent={true}
						visible={this.state.isLoading}
					>
						<View style={styles.modalStyle}>
							<View>
								<ActivityIndicator size="large" color={colors.verdeFinddo} animating={true} />
							</View>
						</View>
					</Modal>
					<Modal
						animationType="slide"
						transparent={true}
						visible={this.state.formInvalid}
					>
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
										style={[
											styles.modalErrosBotaoContinuar,
											{
												marginTop: 8, alignItems: "center", justifyContent: "center",
											},
										]}
										onPress={() => this.setState({formInvalid: false})}>
										<Text style={styles.continuarButtonText}>VOLTAR</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</Modal>
					<View style={styles.cadastroForm}>
						<View
							style={styles.finddoLogoStyle}></View>
						<View style={styles.cadastroMainForm}>
							<Text style={styles.fontTitle}>Crie sua conta</Text>

							<TextInput
								style={styles.cadastroFormSizeAndFont}
								onChangeText={text => {

									this.setState({name: text});

								}}
								placeholder="Nome"
								maxLength={70} numberOfLines={1}
								value={this.state.name}
							/>
							<TextInput
								style={styles.cadastroFormSizeAndFont}
								onChangeText={text => {

									this.setState({surname: text});

								}}
								placeholder="Sobrenome"
								maxLength={255} numberOfLines={1}
								value={this.state.surname}
							/>
							{(() => {

								if (this.state.user_type === "professional") {

									return (
										<TextInput
											style={styles.cadastroFormSizeAndFont}
											onChangeText={text => {

												this.setState({mothers_name: text});

											}}
											placeholder="Nome da Mãe (Completo)"
											maxLength={255} numberOfLines={1}
											value={this.state.mothers_name}
										/>);

								}

								return null;

							})()}
							<TextInput
								style={styles.cadastroFormSizeAndFont}
								onChangeText={text => {

									this.setState({email: text});

								}}
								placeholder="Email"
								keyboardType="email-address"
								autoCapitalize="none"
								maxLength={128} numberOfLines={1}
								value={this.state.email}
							/>
							<TextInput
								style={styles.cadastroFormSizeAndFont}
								onChangeText={text => {

									this.setState({cellphone: text});

								}}
								placeholder="(99) 9999-99999"
								keyboardType="numeric"
								maxLength={15} numberOfLines={1}
								value={this.state.cellphone}
							/>
							<TextInput
								style={styles.cadastroFormSizeAndFont}
								onChangeText={text => {

									this.setState({cpf: text});

								}}
								placeholder="CPF"
								keyboardType="numeric"
								maxLength={11} numberOfLines={1}
								value={this.state.cpf}
							/>
							<TextInput
								style={styles.cadastroFormSizeAndFont}
								onChangeText={text => {

									this.setState({birthdate: text});

								}}
								placeholder="Data de Nascimento dd/mm/aaaa"
								keyboardType="numeric"
								maxLength={10} numberOfLines={1}
								value={this.updateBirthdate(this.state.birthdate)}
							/>
						</View>
						<TouchableOpacity
							style={styles.continuarButton}
							onPress={() => this.validateFields()}>
							<Text style={styles.continuarButtonText}>CONTINUAR</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</ImageBackground>
		);

	}

}

function Item({title}) {

	return (
		<View>
			<Text style={{fontSize: 18}}>{"\t"}{title}</Text>
		</View>
	);

}
