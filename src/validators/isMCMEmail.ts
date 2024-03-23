import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

function IsMCMEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isMCMEmail',
      target: object.constructor, // Use object.constructor for better type safety
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          return value.endsWith('@mcm.edu.ph');
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must end with '@mcm.edu.ph'`;
        },
      },
    });
  };
}

export { IsMCMEmail };
