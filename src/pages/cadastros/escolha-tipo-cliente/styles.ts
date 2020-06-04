import { StyleSheet } from 'react-native';
import { colors } from '../../../colors';

export const styles = StyleSheet.create({
  backgroundImageContent: { width: '100%', height: '100%' },
  escolhaForm: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  escolhaButton: {
    marginTop: 40, marginBottom: 10,
    width: 320, height: 45,
    borderRadius: 20, backgroundColor: colors.verdeFinddo,
    alignItems: 'center', justifyContent: 'center'
  },
  escolhaButtonText: {
    fontSize: 18, color: colors.branco,
    textAlign: 'center'
  },
  fontTitle: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold'
  },
});
