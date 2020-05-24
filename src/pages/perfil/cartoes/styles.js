import { StyleSheet } from 'react-native';
import { colors } from '../../../colors';

export const styles = StyleSheet.create({
  modalStyle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  backgroundImageContent: { width: '100%', height: '100%' },
  sairButton: {
    marginTop: 10, width: 340,
    height: 45, borderRadius: 20,
    backgroundColor: colors.verdeFinddo,
    alignItems: 'center', justifyContent: 'center'
  },
  addButtonText: {
    fontSize: 18, color: colors.branco,
    textAlign: 'center',
  },
  cartoesFormSizeAndFont:
  {
    fontSize: 18,
    height: 45,
    textAlign: 'left',
    width: '80%',
    paddingLeft: 20
  },
  cartoesEnderecoSelect:
  {
    fontSize: 18,
    height: 45,
    textAlign: 'center',
    width: 300,
    textDecorationLine: 'underline',
    textAlignVertical: 'bottom'
  },
  modalStyle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});