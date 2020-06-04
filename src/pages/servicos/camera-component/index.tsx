import React, {Component} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {RNCamera} from "react-native-camera";
import FotoService from "../../../services/foto-service";
import {StackActions} from "react-navigation";
import {styles} from "./styles";

export class CameraPedidoComponent extends Component {

	public camera: any;

	public setState: any;

	public props: any;

	static navigationOptions = {
		headerShown: false,
	};

	constructor(props) {

		super(props);

	}

	state = {
		cameraDefault: RNCamera.Constants.Type.back,
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
						title: "Permissão para usar a câmera",
						message: "Nós precisamos de sua permissão para usar a câmera",
						buttonPositive: "Ok",
						buttonNegative: "Cancelar",
					}}
					androidRecordAudioPermissionOptions={{
						title: "Permissão para gravação de áudio",
						message: "Nós precisamos de sua permissão para gravar áudio",
						buttonPositive: "Ok",
						buttonNegative: "Cancelar",
					}}
					onGoogleVisionBarcodesDetected={({barcodes}) => {
					}}
				/>
				<View style={{flex: 0, flexDirection: "row", justifyContent: "center"}}>
					<TouchableOpacity onPress={() => {

						this.trocarCamera();

					}} style={styles.capture}>
						<Text style={{fontSize: 14}}> Trocar Camera </Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
						<Text style={{fontSize: 14}}> Capturar </Text>
					</TouchableOpacity>
				</View>
			</View>
		);

	}

	trocarCamera = () => {

		if (this.state.cameraDefault === RNCamera.Constants.Type.back)
			this.setState({cameraDefault: RNCamera.Constants.Type.front});
		else
			this.setState({cameraDefault: RNCamera.Constants.Type.back});

	}

	takePicture = async() => {

		if (this.camera) {

			const options = {quality: 0.5, base64: true};

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
