import React, { Component } from 'react';
import { Button, View, Text, TextInput } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import FlatListBasics from './servicos';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { usuario: 'usuario', senha: 'teste' };
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Finddo</Text>
        <TextInput
          style={{ height: 40 }}
          placeholder="usuario"
          onChangeText={(usuario) => this.setState({ usuario: usuario })}
          value={this.state.usuario}
        />
        <TextInput
          style={{ height: 40 }}
          placeholder="senha"
          onChangeText={(senha) => this.setState({ senha: senha })}
          value={this.state.senha}
          secureTextEntry={true}
        />
        <Button
          title="Login"
          onPress={() => this.props.navigation.navigate('Details')}
        />
      </View>
    );
  }
}

class DetailsScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Details Screen</Text>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Details: FlatListBasics,
  },
  {
    initialRouteName: 'Home'
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}
