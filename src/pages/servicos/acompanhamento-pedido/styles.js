import { StyleSheet } from 'react-native';
import { colors } from '../../../colors';

export const styles = StyleSheet.create({
  acompanhamentoContainer: {
    flex: 1, alignItems: 'center',
    justifyContent: 'center', flexDirection: 'row',
    height: 500
  },
  acompanhamentoPontosContainer: {
    height: 500, width: '15%',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  acompanhamentoConteudoContainer: {
    height: 500, width: '85%'
  },
  acompanhamentoBotaoContainer: {
    flex: 1, alignItems: 'center',
    justifyContent: 'flex-end'
  },
  acompanhamentoBotao: {
    width: 340, height: 45,
    borderRadius: 20, backgroundColor: colors.verdeFinddo,
    marginBottom: 6, alignItems: 'center',
    justifyContent: 'center'
  },
  corBotao: {
    fontSize: 18, color: colors.branco,
    textAlign: 'center'
  }
});