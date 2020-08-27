type Formatter = (text: string) => string;
type FormattingFilter = (text: string) => string;

export const creditCardFormatter: Formatter = text =>
	text.match(/[0-9]{1,4}/g)?.join(" ") ?? "";

export const monthYearFormatter: Formatter = text =>
	text.match(/[0-9]{1,2}/g)?.join("/") ?? "";

export const cpfFormatter: Formatter = text =>
	text
		.replace(/([0-9]{3})([0-9])/, "$1.$2")
		.replace(/([0-9]{3})([0-9])/, "$1.$2")
		.replace(/([0-9]{3})([0-9]{1,2})/, "$1-$2");

export const cepFormatter: Formatter = text =>
	text.replace(/([0-9]{5})([0-9])/, "$1-$2");

export const priceFormatter: Formatter = text => {
	if (text.length === 1) return text.replace(/([0-9]{1})/, "R$  , $1");
	else if (text.length === 2) return text.replace(/([0-9]{2})/, "R$  ,$1");

	return text.replace(/([0-9]{0,5})([0-9]{2})/, "R$ $1,$2");
};

export const phoneFormatter: Formatter = text =>
	text
		.replace(/([0-9]{2})([0-9])/, "($1) $2")
		.replace(/([0-9]{5})([0-9]{1,4})/, "$1-$2");

export const numericFormattingFilter: FormattingFilter = text =>
	text.replace(/[^0-9]/g, "");
