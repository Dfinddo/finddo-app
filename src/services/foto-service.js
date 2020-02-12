export default class FotoService {
  static myInstance = null;

  _fotoData = null;

  /**
   * @returns {FotoService}
   */
  static getInstance() {
    if (FotoService.myInstance == null) {
      FotoService.myInstance = new FotoService();
    }

    return this.myInstance;
  }

  setFotoData(data) {
    this._fotoData = data;
  }

  getFotoData() {
    return this._fotoData;
  }
}