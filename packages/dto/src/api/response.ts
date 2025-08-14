export type ErrorResponse = {
	errorCode: string;
	errorDescription: string;
	errorMessage: string;
	statusCode: number;
}

export interface SuccessResponse<DataResponse = object | [] | null > {
	status: number,
	message: string,
	data: DataResponse;
}

export type APIResponse<DataResponse = object | [] | null> = SuccessResponse<DataResponse> & ErrorResponse;

export type Pagination<Result> = {
	data: Result[];
	page: number;
	total: number;
	totalPage: number;
}