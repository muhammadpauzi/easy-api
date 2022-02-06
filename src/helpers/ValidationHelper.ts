import { validate, ValidationError } from 'class-validator';
import { EntitySchema } from 'typeorm';
import StringHelper from './StringHelper';

export default class ValidationHelper {
    public static getValidationMessage(
        message: string,
        fieldName: string
    ): string {
        return message.replace(':attribute', fieldName);
    }

    public static buildErrorValidation(
        validationErrors: ValidationError[]
    ): any {
        let result: any = {};
        validationErrors.map((error) => {
            result[error.property] =
                error.constraints &&
                StringHelper.upperCaseFirstLetterOfSentence(
                    error.constraints[Object.keys(error.constraints)[0]]
                );
        });
        return result;
    }

    public static async validateData(
        entity: any,
        body: any
    ): Promise<boolean | object> {
        let objEntity = new entity();
        Object.assign(objEntity, body);
        const errors = await validate(objEntity);
        return errors.length > 0 ? this.buildErrorValidation(errors) : true;
    }
}
