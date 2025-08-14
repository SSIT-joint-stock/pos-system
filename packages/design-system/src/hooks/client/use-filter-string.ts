import { useCallback, useState } from "react";

export type FilterString = string;
export type FilterKey = string;

export type UseFilterStringReturn<Schema extends Record<string, string>> = {
	filter: FilterString,
	editFilter: (key: keyof Schema, value: string) => void,
	editMultipleFilter: (filter: Partial<Record<keyof Schema, string>>) => void,
	removeFilter: (key: keyof Schema) => void,
	getFilter: () => Record<keyof Schema, string>,
	setFilterString: (filterString: string) => void,
	resetFilter: () => void
};

export const useFilterString = <Schema extends Record<string, string>>(filterString: string): UseFilterStringReturn<Schema> => {
	const [filter, setFilter] = useState<string>(filterString);

	const editFilter = useCallback((key: keyof Schema, value: string) => {
		const parse = filter.split(",");
		const index = parse.findIndex((item) => item.split(":")[0].trim() === key);

		if (index !== -1) {
			parse[index] = `${String(key)}:${value}`;
		} else {
			parse.push(`${String(key)}:${value}`);
		}

		setFilter(parse.join(","));
	}, [filter]);

	const parseToFilter = useCallback((filter: Record<keyof Schema, string>) => {
		const parse = Object.entries(filter).map(([key, value]) => `${key}:${value}`);
		return parse.join(",");
	}, []);

	const removeFilter = useCallback((key: keyof Schema) => {
		const parse = filter.split(",");
		const index = parse.findIndex((item) => item.split(":")[0].trim() === key);

		if (index !== -1) {
			parse.splice(index, 1);
		}

		setFilter(parse.join(","));
	}, [filter]);

	const getFilter = useCallback(() => {
		const parse = filter.split(",");
		const result: Record<string, string> = {};
		parse.forEach((item) => {
			if (!item) return;
			const [key, value] = item.split(":");
			result[key.trim()] = (value || "").trim();
		});

		return result as Record<keyof Schema, string>;
	}, [filter]);

	const editMultipleFilter = useCallback((filter: Partial<Record<keyof Schema, string>>) => {
		const parse = getFilter();
		Object.assign(parse, filter);

		setFilter(parseToFilter(parse));
	}, [getFilter, parseToFilter]);


	const setFilterString = useCallback((filterString: string) => {
		setFilter(filterString);
	}, []);

	const resetFilter = useCallback(() => {
		setFilter('');
	}, []);

	return {
		filter,
		editFilter,
		editMultipleFilter,
		removeFilter,
		getFilter,
		setFilterString,
		resetFilter
	};
}

// export type MultiFilterString = Record<string, string>;
//
// export type UseMultiFilterStringReturn<Schema extends Record<string, any>> = [
// 	MultiFilterString,
// 	(key: keyof Schema, value: string) => void,
// 	() => Record<keyof Schema, string>
// ];
//
// export const useMultiFilterString = <Schema extends Record<string, any>>(filter: Record<keyof Schema, string>): UseFilterStringReturn<Schema> => {
// 	const [filter, setFilter] = useState<Record<keyof Schema, string>>(filter);
//
// 	const editFilter = useCallback((key: keyof Schema, value: string) => {
// 		const parse = filter;
// 		parse[key] = value;
// 		setFilter(parse);
// 	}, [filter]);
//
// 	const getFilter = useCallback(() => {
// 		return filter;
// 	}, [filter]);
//
// 	return [filter, editFilter, getFilter];
// }