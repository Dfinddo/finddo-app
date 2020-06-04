export default class CartaoFormService {

	public myInstance: any;

	static myInstance = null;

	_adicionarNovoCard = false;

	/**
   * @returns {CartaoFormService}
   */
	static getInstance() {

		if (CartaoFormService.myInstance == null)
			CartaoFormService.myInstance = new CartaoFormService();


		return this.myInstance;

	}

	isAdicionarNovoCard() {

		return this._adicionarNovoCard;

	}

	setAdicionarNovoCard(status) {

		this._adicionarNovoCard = status;

	}

}
