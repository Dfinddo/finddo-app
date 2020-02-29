import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import FotoService from '../../services/foto-service';
import { StackActions } from 'react-navigation';

export class CameraPedidoComponent extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
  }

  state = {
    cameraDefault: RNCamera.Constants.Type.back
  }

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={this.state.cameraDefault}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permissão para usar a câmera',
            message: 'Nós precisamos de sua permissão para usar a câmera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancelar',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permissão para gravação de áudio',
            message: 'Nós precisamos de sua permissão para gravar áudio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancelar',
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
          }}
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => { this.trocarCamera() }} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> Trocar Camera </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> Capturar </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  trocarCamera = () => {
    if (this.state.cameraDefault === RNCamera.Constants.Type.back) {
      this.setState({ cameraDefault: RNCamera.Constants.Type.front });
    } else {
      this.setState({ cameraDefault: RNCamera.Constants.Type.back });
    }
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      this.camera.takePictureAsync(options).then(data => {
        const fotoService = FotoService.getInstance();
        fotoService.setFotoData(data);
        const popAction = StackActions.pop({
          n: 1,
        });
        this.props.navigation.dispatch(popAction);
      });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});