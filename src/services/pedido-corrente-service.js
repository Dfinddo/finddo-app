import AsyncStorage from '@react-native-community/async-storage';

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

  salvarPedidoLocalStorage(pedido) {
    return AsyncStorage.setItem('pedido-corrente', JSON.stringify(pedido));
  }

  // TODO: verificar se as fotos aparecem normalmente
  setPedidoFromLocalStorage(pedido) {
    const pedidoSalvo = JSON.parse(pedido);
    pedidoSalvo.dataPedido = new Date(pedidoSalvo.dataPedido);

    this._pedidoCorrente = pedidoSalvo;
  }

  getPedidoLocalStorage() {
    return AsyncStorage.getItem('pedido-corrente');
  }
}
