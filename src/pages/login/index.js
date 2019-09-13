import React, { Component } from 'react';
import { Button, View, Text, TextInput } from 'react-native';

export default class LoginScreen extends Component {
  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { usuario: 'usuario', senha: 'teste' };
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{fontSize: 30}}>Finddo</Text>
        <TextInput
          style={{fontSize:25, height: 45 }}
          placeholder="usuario"
          onChangeText={(usuario) => this.setState({ usuario: usuario })}
          value={this.state.usuario}
        />
        <TextInput
          style={{fontSize: 25, height: 45 }}
          placeholder="senha"
          onChangeText={(senha) => this.setState({ senha: senha })}
          value={this.state.senha}
          secureTextEntry={true}
        />
        <Button
          title="Login"
          onPress={() => this.props.navigation.navigate('Servicos')}
        />
      </View>
    );
  }
}
