import {Input, InputProps} from "@ui-kitten/components";
import React, {FC} from "react";

interface MaskedInputProps extends InputProps {
	formatter: (rawText: string) => string | undefined;
	formattingFilter: (formatedText: string) => string;
}

/**
 * An input that displays the string passed as value formated by a function and
 * passes the unformatted input value to the onChangeText callback.
 * @method      MaskedInput
 * @param       MaskedInputProps    props Receives the same props of an input
 * plus a formatter function to format the raw text in value and a
 * formattingFilter function to remove formatting.
 */
const MaskedInput: FC<MaskedInputProps> = props => {
	const {formatter, formattingFilter, value, ...inputProps} = props;

	const onChangeText = (formatedText: string): void => {
		const text = formattingFilter(formatedText);

		props.onChangeText?.(text);
	};

	return (
		<Input
			{...inputProps}
			onChangeText={onChangeText}
			value={value && formatter(value)}
		/>
	);
};

export type {MaskedInputProps};
export default MaskedInput;
