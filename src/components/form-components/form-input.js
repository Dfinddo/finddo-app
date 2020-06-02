import React from "react";
import { View, Text, TextInput } from "react-native";
import { colors } from "../../colors";

const FormInput = ({ label, style, inputError, ...inputProps }) => (
  <View style={wrapperStyle}>
    <Text>{label}</Text>
    <TextInput
      style={[inputError ? errorStyles : defaultStyles, style]}
      {...inputProps}
    />
    <Text>{inputError}</Text>
  </View>
);

const wrapperStyle = {
  marginTop: 6
};

const defaultStyles = {
  fontSize: 18,
  height: 45,
  borderBottomColor: colors.verdeFinddo,
  borderBottomWidth: 2,
  textAlign: "left",
  width: 300
};

const errorStyles = Object.assign({}, defaultStyles, {
  borderBottomColor: colors.vermelhoExcluir
});

export { FormInput };
