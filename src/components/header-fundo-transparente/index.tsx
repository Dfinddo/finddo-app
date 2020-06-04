import React, {Component} from "react";
import {View} from "react-native";
import {SvgXml} from "react-native-svg";
import {finddoLogo} from "../../img/svg/finddo-logo";

export default class HeaderFundoTransparente extends Component {

	public render() {

		return (
			<View style={{flex: 1, alignItems: "flex-start", justifyContent: "center"}}>
				<SvgXml xml={finddoLogo} width={130} height={30} style={{marginLeft: 62}}></SvgXml>
			</View>
		);

	}

}
