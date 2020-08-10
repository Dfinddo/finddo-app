import React, {FC} from "react";
import {Select, SelectProps, IndexPath} from "@ui-kitten/components";
import {useSwitch} from "hooks";

interface ValidatedSelectProps
	extends Omit<SelectProps, "onSelect" | "multiSelect"> {
	onSelect?: (index: number) => void;
	error?: string;
	forceErrorDisplay?: boolean;
}

const ValidatedSelect: FC<ValidatedSelectProps> = props => {
	const {onSelect, forceErrorDisplay, error, ...selectProps} = props;
	const [hasLostFocus, setHasLostFocus] = useSwitch(false);
	const showError = (hasLostFocus || forceErrorDisplay) && error;

	const onBlur: SelectProps["onBlur"] = event => {
		setHasLostFocus();
		props.onBlur?.(event);
	};

	return (
		<Select
			{...selectProps}
			onBlur={onBlur}
			onSelect={index => onSelect?.((index as IndexPath).row)}
			caption={showError ? error : " "}
			status={showError ? "danger" : void 0}
		/>
	);
};

export default ValidatedSelect;
