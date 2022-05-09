import Joi from 'joi';

export default class AirportValidation {
    public async airportValidation(data) {
        const schema = Joi.object ({
            code   : Joi.string().min(2).max(3).required().label('code').messages({
                        'string.empty': `code cannot be an empty field`,
                        'string.min': `code should have a minimum length of {#limit}`,
                        'string.max': `code should have a maximum length of {#limit}`,
                        'any.required': `code is a required field`
                    }),
            city   : Joi.string().min(3).required().label('city').messages({
                        'string.empty': `city cannot be an empty field`,
                        'string.min': `city should have a minimum length of {#limit}`,
                        'any.required': `city is a required field`
                    }),
            name   : Joi.string().min(3).required().label('name').messages({
                        'string.empty': `name cannot be an empty field`,
                        'string.min': `name should have a minimum length of {#limit}`,
                        'any.required': `name is a required field`
                    })
        });
        return await schema.validateAsync(data);
    }
}