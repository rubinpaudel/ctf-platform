import { ErrorType } from "../../types/apiTypes/ErrorType";
import { ErrorValidation } from "../../types/apiTypes/ErrorType";
import { ErrorResponse } from "../../types/apiTypes/ErrorResponse";


export class APIError extends Error {


    private httpStatusCode: number;
    private errorType: ErrorType;
    private errors: string[] | null;
    private errorsValidation: ErrorValidation[] | null;

    constructor(
        httpStatusCode : number,
        errorType : ErrorType,
        message : string,
        errors : string[] | null = null,
        errorsValidation : ErrorValidation[] | null = null
    ) {
        super(message);
        this.name = this.constructor.name;

        
        this.httpStatusCode = httpStatusCode;
        this.errorType = errorType;
        this.errors = errors;
        this.errorsValidation = errorsValidation;
    }


    get HttpStatusCode() {
        return this.httpStatusCode;
    }

    get JSON(): ErrorResponse {
        return {
          errorType: this.errorType,
          errorMessage: this.message,
          errors: this.errors,
          errorsValidation: this.errorsValidation,
        };
      }

}