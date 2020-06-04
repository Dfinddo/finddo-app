import React from "react";
import {
	View, Text,
	TouchableOpacity, ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {colors} from "../../colors";

export default function AccordianInfoContato(props) {

	if (props.opened === false) {

		return (
			<View style={{
				width: 320,
				height: 70,
				backgroundColor: colors.branco,
				flexDirection: "row",
			}}>
				<View style={{
					width: 280,
					alignItems: "flex-start",
					justifyContent: "center",
					paddingLeft: 10,
				}}>
					<Text style={{
						color: colors.preto,
						fontSize: 22,
						fontWeight: "bold",
					}}>Contato</Text>
				</View>
				<View style={{
					width: 40,
					alignItems: "center",
					justifyContent: "center",
				}}>
					<TouchableOpacity onPress={props.onPress}>
						<Icon
							name={"keyboard-arrow-down"}
							size={35} color={colors.preto} />
					</TouchableOpacity>
				</View>
			</View>
		);

	}

	return (
		<View style={{maxHeight: 140, flex: 1}}>
			<View style={{
				width: 320,
				height: 70,
				backgroundColor: colors.branco,
				flexDirection: "row",
			}}>
				<View style={{
					width: 280,
					alignItems: "flex-start",
					justifyContent: "center",
					paddingLeft: 10,
				}}>
					<Text style={{
						color: colors.preto,
						fontSize: 22,
						fontWeight: "bold",
					}}>Contato</Text>
				</View>
				<View style={{
					width: 40,
					alignItems: "center",
					justifyContent: "center",
				}}>
					<TouchableOpacity onPress={props.onPress}>
						<Icon
							name={"keyboard-arrow-up"}
							size={35} color={colors.preto} />
					</TouchableOpacity>
				</View>
			</View>
			<ScrollView>
				<View style={{
					width: 320,
					backgroundColor: colors.branco,
					alignItems: "center",
					justifyContent: "center",
				}}>
					<TouchableOpacity
						onPress={props.onPressAction}
						style={{
							width: 300,
							backgroundColor: colors.verdeFinddo,
							alignItems: "center",
							justifyContent: "center",
							height: 45,
							borderRadius: 20,
							marginBottom: 10,
						}}>
						<Text style={{color: colors.branco, fontSize: 18}}>FALE CONOSCO</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>);

}
