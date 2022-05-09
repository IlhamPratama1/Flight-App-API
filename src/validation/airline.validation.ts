import Joi from 'joi';

export default class AirlineValidation {
    public async airlineValidation(data) {
        const schema = Joi.object ({
            name   : Joi.string().min(2).required().label('name').messages({
                        'string.empty': `name cannot be an empty field`,
                        'string.min': `name should have a minimum length of {#limit}`,
                        'any.required': `name is a required field`
                    })
        });
        return await schema.validateAsync(data);
    }
}