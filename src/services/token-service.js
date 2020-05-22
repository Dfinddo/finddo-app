/**
 * Responsável por guardar informações de:
 *   - Autenticação (tokens)
 *   - Usuário logado
 *   - ID do device do usuário
 */
export default class TokenService {
  static myInstance = null;

  _tokenData = null;
  _user = null;
  _playerID = null;

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

  setUser(userDto) {
    this._user = userDto;
  }

  setPlayerIDOneSignal(playerID) {
    this._playerID = playerID;
  }

  getToken() {
    return this._tokenData;
  }

  getUser() {
    return this._user;
  }

  getHeaders() {
    const headers = {};
    headers['access-token'] = this._tokenData['access-token'];
    headers['client'] = this._tokenData['client'];
    headers['uid'] = this._tokenData['uid'];
    headers['Content-Type'] = 'application/json';

    return headers;
  }

  getPlayerIDOneSignal() {
    return this._playerID;
  }
}
