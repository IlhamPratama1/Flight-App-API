import Joi from 'joi';

export default class AuthValidation {
    public async signUpValidation(data) {
        const schema = Joi.object({
            username    : Joi.string().min(2).required().label('username').messages({
                            'string.empty': `email cannot be an empty field`,
                            'string.min': `email should have a minimum length of {#limit}`,
                            'any.required': `email is a required field`,
                        }),
            email       : Joi.string().min(6).required().email().label('email').messages({
                            'string.empty': `email cannot be an empty field`,
                            'string.min': `email should have a minimum length of {#limit}`,
                            'any.required': `email is a required field`,
                        }),
            password    : Joi.string().min(6).required().label('password').messages({
                            'string.empty': `password cannot be an empty field`,
                            'string.min': `password should have a minimum length of 6`,
                            'any.required': `password is a required field`,
                        }),
            role        : Joi.array().required().label('role').messages({
                            'array.empty': `role cannot be an empty data, choose "user" or "admin" or both`,
                            'any.required': `role is a required field`,
                        })
        });
        return await schema.validateAsync(data);
    }
    
    public async signInValidation(data) {
        const schema = Joi.object ({
            email       : Joi.string().min(6).required().email().label('email').messages({
                            'string.empty': `email cannot be an empty field`,
                            'string.min': `email should have a minimum length of {#limit}`,
                            'any.required': `email is a required field`
                        }),
            password    :Joi.string().min(6).required().label('password').messages({
                            'string.empty': `password cannot be an empty field`,
                            'string.min': `password should have a minimum length of 6`,
                            'any.required': `password is a required field`
                        })
        });
        return await schema.validateAsync(data);
    }
    
    public async accessTokenValidation(data) {
        const schema = Joi.object({
            refreshToken    : Joi.string().required().label('refreshToken').messages({
                                'string.empty': `{{#label}} cannot be an empty field`,
                                'any.required': `{{#label}} is a required field`,
                            })
        });
        return await schema.validateAsync(data);
    }
    
    public async forgetPasswordValidation(data) {
        const schema = Joi.object ({
            email   : Joi.string().min(6).required().email().label('email').messages({
                        'string.empty': `email cannot be an empty field`,
                        'string.min': `email should have a minimum length of {#limit}`,
                        'any.required': `email is a required field`
                    })
        });
        return await schema.validateAsync(data);
    }
}
