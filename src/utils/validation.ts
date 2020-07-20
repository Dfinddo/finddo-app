type InputTest = (input: string) => string | undefined

const NUMBER_REGEX = /^[0-9]*$/;
const DECIMAL_REGEX = /^-?\\d*(\\.\\d+)?$"/;
const EMAIL_REGEX = /^[^\s@#!]+@[^\s@.#!]+.[^\s@.]+$/;

const validateInput =
	(value: string, tests: InputTest[]): string | undefined => {

		let error: string | undefined;

		for (const test of tests) if (error = test(value)) break;

		return error;

	};

const validations = {
	required: (): InputTest => input => (input.length === 0 ?
		"É obrigatório." : void 0),

	minLength: (length: number): InputTest => input => (input.length < length ?
		`Precisa ter pelo menos ${length} caracteres.` : void 0),

	maxLength: (length: number): InputTest => input => (input.length > length ?
		`Tamanho máximo de ${length} caracteres.` : void 0),

	definedLength: (length: number): InputTest => input =>
		(input.length !== length ? `Precisa ter ${length} caracteres.` : void 0),

	onlyNumbers: (): InputTest => input => (!NUMBER_REGEX.test(input) ?
		"Apenas números." : void 0),

	onlyDecimals: (): InputTest => input => (!DECIMAL_REGEX.test(input) ?
		"Apenas números decimais." : void 0),

	validEmail: (): InputTest => input => (!EMAIL_REGEX.test(input) ?
		"Precisa ser um email válido." : void 0),
};

export type {InputTest};
export {validateInput, validations};
