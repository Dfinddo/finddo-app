export default class UserDTO {

	constructor(
		params,
	) {

		Object.keys(params).forEach(param => {

			this[`${param}`] = params[`${param}`];

		});

	}

	static gerarUsuarioComEnderecoDefault(dto) {

		const name = "Padrão";
		const street = dto.rua;
		const number = dto.numero;
		const complement = dto.complemento;
		const {cep} = dto;
		const district = dto.bairro;
		const state = dto.estado;
		const city = dto.cidade;
		const selected = true;

		delete dto.rua;
		delete dto.numero;
		delete dto.complemento;
		delete dto.cep;
		delete dto.bairro;
		delete dto.estado;
		delete dto.cidade;

		const address = {name, street, number, complement, cep, district, state, city, selected};

		return {user: dto, address};

	}

}
