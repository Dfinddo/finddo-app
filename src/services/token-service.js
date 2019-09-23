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

  getHeaders() {
    const headers = {};
    headers['access-token'] = this._tokenData['access-token'];
    headers['client'] = this._tokenData['client'];
    headers['uid'] = this._tokenData['uid'];

    return headers;
  }
}