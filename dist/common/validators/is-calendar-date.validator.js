"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsCalendarDate = IsCalendarDate;
const class_validator_1 = require("class-validator");
const fechas_1 = require("../fechas");
function IsCalendarDate(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isCalendarDate',
            target: object.constructor,
            propertyName: propertyName.toString(),
            options: validationOptions,
            validator: {
                validate(value) {
                    return (0, fechas_1.esFechaCalendario)(value);
                },
                defaultMessage() {
                    return 'La fecha debe ser válida y tener el formato YYYY-MM-DD';
                },
            },
        });
    };
}
//# sourceMappingURL=is-calendar-date.validator.js.map