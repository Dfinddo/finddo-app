import { StyleSheet } from 'react-native';
import { colors } from '../../colors';

export const styles = StyleSheet.create({
  centralizar: { alignItems: 'center', justifyContent: 'center' },
  botaoPrincipalSelectContainer: {
    flex: 1, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between'
  },
  rotuloSelecionado: { marginLeft: 10, fontSize: 18 },
  setaDropdown: { width: 35 },
  modalSelecaoContainer: {
    flex: 1, backgroundColor: colors.transparenciaModais,
  },
  itemSelecionavelContainer: {
    width: 320, height: 50,
    backgroundColor: colors.branco, marginVertical: 10
  },
  listaDeItems: { marginVertical: 20, flex: 1 }
});
