export default class PedidoCorrenteService {
  static myInstance = null;

  _pedidoCorrente = null;

	/**
	 * @returns {PedidoCorrenteService}
	 */
  static getInstance() {
    if (PedidoCorrenteService.myInstance == null) {
      PedidoCorrenteService.myInstance = new PedidoCorrenteService();
    }

    return this.myInstance;
  }

  setPedidoCorrente(pedidoCorrente) {
    this._pedidoCorrente = pedidoCorrente;
  }

  getPedidoCorrente() {
    return this._pedidoCorrente;
  }
}
