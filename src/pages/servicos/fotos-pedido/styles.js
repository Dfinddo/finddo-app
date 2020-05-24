import { StyleSheet } from 'react-native';
import { colors } from '../../../colors';

export const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)'
  },
  imagemCategoriaContainer: {
    height: 540,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  formPedidoContainer: {
    height: 300, paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%', justifyContent: 'flex-start'
  },
  maisFotosContainer: {
    marginTop: 8, height: 300,
    backgroundColor: colors.branco,
    width: '100%'
  },
  fotosProblemaContainer: {
    flexDirection: 'row', justifyContent: 'space-evenly',
    alignItems: 'center', marginTop: 30
  },
  botaoContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  botaoContinuar: {
    width: 340, height: 45,
    borderRadius: 20, backgroundColor: colors.verdeFinddo,
    marginBottom: 6, alignItems: 'center',
    justifyContent: 'center'
  },
  botaoContinuarTexto: {
    fontSize: 18, color: colors.branco,
    textAlign: 'center'
  }
});