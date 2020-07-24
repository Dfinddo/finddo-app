import {Input, InputProps} from "@ui-kitten/components";
import React, {FC} from "react";
import {useSwitch} from "hooks";
import {ValidatedInputProps} from "components/ValidatedInput";
import {MaskedInputProps} from "components/MaskedInput";

type ValidatedMaskedInputProps = ValidatedInputProps & MaskedInputProps;

/**
 * An input that displays the string passed as value formated by a function and
 * passes the unformatted input value to the onChangeText callback. Receives an
 * optional error message to display if its value is invalid.
 * @method      MaskedInput
 * @param       MaskedInputProps    props Receives the same props of an input
 * plus a formatter function to format the raw text in value, a
 * formattingFilter function to remove formatting and an optional error string
 * to be displayed when the component lose focus. The input can be configured to
 * show error messages even if it has not yet lost focus through the
 * forceErrorDisplay prop.
 */
const ValidatedMaskedInput: FC<ValidatedMaskedInputProps> = props => {
	const {
		formatter,
		formattingFilter,
		value,
		forceErrorDisplay,
		error,
		...inputProps
	} = props;
	const [hasLostFocus, setHasLostFocus] = useSwitch(false);
	const showError = (hasLostFocus || forceErrorDisplay) && error;

	const onChangeText = (formatedText: string): void => {
		const text = formattingFilter(formatedText);

		props.onChangeText?.(text);
	};

	const onBlur: InputProps["onBlur"] = event => {
		setHasLostFocus();
		props.onBlur?.(event);
	};

	return (
		<Input
			{...inputProps}
			onBlur={onBlur}
			onChangeText={onChangeText}
			value={value && formatter(value)}
			caption={showError ? error : " "}
			status={showError ? "danger" : void 0}
		/>
	);
};

export default ValidatedMaskedInput;
