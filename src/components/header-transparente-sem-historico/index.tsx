import React, {Component} from "react";
import {View} from "react-native";
import {SvgXml} from "react-native-svg";
import {finddoLogo} from "../../img/svg/finddo-logo";

export default class HeaderTransparenteSemHistorico extends Component {

	public render() {

		return (
			<View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
				<SvgXml xml={finddoLogo} width={130} height={30}></SvgXml>
			</View>
		);

	}

}
