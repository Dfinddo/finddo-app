import { StyleSheet } from 'react-native';
import { colors } from '../../../colors';

export const styles = StyleSheet.create({
  modalStyle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  backgroundImageContent: { width: '100%', height: '100%' },
  finddoLogoStyle: { marginTop: 60, marginBottom: 120 },
  loginForm: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
  loginMainForm: { alignItems: 'center', justifyContent: 'center', width: 340, height: 250, backgroundColor: colors.branco },
  loginButton: {
    marginTop: 40, marginBottom: 10,
    width: 340, height: 45,
    borderRadius: 20, backgroundColor: colors.verdeFinddo,
    alignItems: 'center', justifyContent: 'center'
  },
  loginButtonText: {
    fontSize: 18, color: colors.branco, textAlign: 'center'
  },
  loginFormSizeAndFont:
  {
    fontSize: 18,
    height: 45,
    borderBottomColor: colors.verdeFinddo,
    borderBottomWidth: 2,
    textAlign: 'left',
    width: 300,
  },
  loginEsqueciSenha:
  {
    fontSize: 18,
    height: 45,
    textAlign: 'center',
    width: 300,
    textDecorationLine: 'underline',
    textAlignVertical: 'bottom'
  },
  fontTitle: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  cadastreSe: { fontWeight: 'bold', textDecorationLine: 'underline' }
});