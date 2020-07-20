/**
 * Creates an object composed of the picked `source` properties.
 *
 * @param source The source object.
 * @param properties The properties to pick.
 * @returns The new object.
 */
function pick<T, K extends keyof T>(
	source: T,
	properties: readonly K[],
): Pick<T, K> {
	const result = {} as Pick<T, K>;

	properties.forEach(property => (result[property] = source[property]));

	return result;
}

/**
 * Creates an array of linearly spaced numbers.
 *
 * @param stop The end of the range.
 * @returns The range array.
 */
function range(stop: number): number[];

/**
 * Creates an array of linearly spaced numbers.
 *
 * @param start The start of the range.
 * @param stop The end of the range.
 * @param step The difference between consecutive elements.
 * @returns The range array.
 */
function range(start: number, stop: number, step?: number): number[];

function range(start: number, stop?: number, step = 1): number[] {
	// If only one argument is given, treat it as the end of the range
	const [rangeStart, rangeStop] =
		typeof stop === "number" ? [start, stop] : [1, start];

	return Array(Math.ceil((rangeStop - rangeStart) / step))
		.fill(rangeStart)
		.map((_, i) => rangeStart + i * step);
}

export * from "./validation";
export * from "./formatting";
export {pick, range};
