import {Input, InputProps} from "@ui-kitten/components";
import React, {FC} from "react";
import {useSwitch} from "../hooks";

interface ValidatedInputProps extends InputProps {
	error?: string;
	forceErrorDisplay?: boolean;
}

/**
 * An input that receives an optional error message to display if its value is
 * invalid.
 * @method      ValidatedInput
 * @param       ValidatedInputProps    props Receives the same props of an input
 * plus an error string to be displayed when the component lose focus. The input
 * can be configured to show error messages even if it has not yet lost focus
 * through the forceErrorDisplay prop.
 */
const ValidatedInput: FC<ValidatedInputProps> = props => {
	const {value, forceErrorDisplay, error, ...inputProps} = props;
	const [hasLostFocus, setHasLostFocus] = useSwitch(false);
	const showError = (hasLostFocus || forceErrorDisplay) && error;

	const onBlur: InputProps["onBlur"] = event => {
		setHasLostFocus();
		props.onBlur?.(event);
	};

	return (
		<Input
			{...inputProps}
			onBlur={onBlur}
			value={value}
			caption={showError ? error : " "}
			status={showError ? "danger" : void 0}
		/>
	);
};

export type {ValidatedInputProps};
export default ValidatedInput;
