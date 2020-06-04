export default class FotoService {

	public myInstance: any;

	static myInstance = null;

	_fotoData = null;

	_fotoId = null;

	/**
   * @returns {FotoService}
   */
	static getInstance() {

		if (FotoService.myInstance == null)
			FotoService.myInstance = new FotoService();


		return this.myInstance;

	}

	setFotoData(data) {

		this._fotoData = data;

	}

	getFotoData() {

		return this._fotoData;

	}

	setFotoId(newId) {

		this._fotoId = newId;

	}

	getFotoId() {

		return this._fotoId;

	}

}
