type ErrorCode = "Validation" | "Conflict" | "Unknown" | "NotFound";

export class Result<Value = undefined> {
	value: Value;

	constructor(value: Value) {
		this.value = value;
	}

	isOk(): this is Result<Value> {
		return this instanceof Result;
	}

	isErr(): this is ErrorResult {
		return this instanceof ErrorResult;
	}

	static ok<T>(value: T): Result<T> {
		return new Result(value);
	}

	static err(code: ErrorCode, message: string): ErrorResult {
		return new ErrorResult({ code, message });
	}
}

class ErrorResult extends Result {
	error: {
		code: ErrorCode;
		message: string;
	};

	constructor(error: { code: ErrorCode; message: string }) {
		super(undefined);
		this.error = error;
	}
}
