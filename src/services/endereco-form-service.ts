export default class EnderecoFormService {

	public myInstance: any;

	static myInstance = null;

	_adicionarNovoEndServico = false;

	/**
   * @returns {EnderecoFormService}
   */
	static getInstance() {

		if (EnderecoFormService.myInstance == null)
			EnderecoFormService.myInstance = new EnderecoFormService();


		return this.myInstance;

	}

	isAdicionarNovoEndServico() {

		return this._adicionarNovoEndServico;

	}

	setAdicionarNovoEndServico(status) {

		this._adicionarNovoEndServico = status;

	}

}
