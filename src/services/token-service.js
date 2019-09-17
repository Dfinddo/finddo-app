export default class TokenService {
  static myInstance = null;

  _tokenData = '';

  /**
   * @returns {TokenService}
   */
  static getInstance() {
    if (TokenService.myInstance == null) {
        TokenService.myInstance = new TokenService();
    }

    return this.myInstance;
}

  setToken(token) {
    this._tokenData = token;
  }

  getToken() {
    return this._tokenData;
  }
}