declare global {
	/**
	 * Await<T> tạo ra một kiểu mới từ T, trong đó các thuộc tính của T được chuyển thành Promise
	 * Ví dụ: Await<Promise<number>> = number
	 */
	type Await<T> = T extends {
		then(onfulfilled?: (value: infer U) => unknown): unknown;
	} ? U : T;
	/**
	 * ExcludeProperties<U, T extends keyof U> tạo ra một kiểu mới từ U, trong đó các thuộc tính T được loại bỏ
	 * Ví dụ: ExcludeProperties<{ a: number, b: string }, 'a'> = { b: string }
	 */
	type ExcludeProperties<U, T extends keyof U> = {
		[K in keyof U as K extends T ? never : K]: U[K];
	};
	/**
	 * Merge<A, B> tạo ra một kiểu mới từ A và B, trong đó các thuộc tính của B sẽ ghi đè lên các thuộc tính của A
	 * Ví dụ: Merge<{ a: number, b: string }, { b: number, c: string }> = { a: number, b: number, c: string }
	 */
	type Merge<A, B> = ({ [K in keyof A]: K extends keyof B ? B[K] : A[K] } &
		B) extends infer O
		? { [K in keyof O]: O[K] }
		: never;
	/**
	 * PartialBy<T, K> tạo ra một kiểu mới từ T, trong đó các thuộc tính K được chuyển thành optional
	 * Ví dụ: PartialBy<{ a: number, b: string }, 'a'> = { b: string }
	 */
	type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
	/**
	 * NullableProperties<T> tạo ra một kiểu mới từ T, trong đó tất cả các thuộc tính đều là nullable
	 * Ví dụ: NullableProperties<{ a: number, b: string }> = { a: number | null, b: string | null }
	 */
	type NullableProperties<T> = {
		[K in keyof T]: T[K] | null;
	}
	/**
	 * OptionalProperties<T> tạo ra một kiểu mới từ T, trong đó tất cả các thuộc tính đều là optional
	 * Ví dụ: OptionalProperties<{ a: number, b: string }> = { a?: number, b?: string }
	 */
	type OptionalProperties<T> = {
		[K in keyof T]?: T[K];
	}
}

export {};