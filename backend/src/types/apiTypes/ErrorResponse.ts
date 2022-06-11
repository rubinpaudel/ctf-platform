import { ErrorType, ErrorValidation } from "./ErrorType"

export type ErrorResponse = {

    errorType : ErrorType;
    errorMessage : string;
    errors: string[] | null;
    errorsValidation : ErrorValidation[] | null;
}