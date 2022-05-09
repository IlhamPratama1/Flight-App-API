import Joi from "joi";

export default class FlightValidation {
    public async flightValidation(data) {
        const schema = Joi.object({
            airlineId   : Joi.number().required().label('airlineId').messages({
                            'number.empty': `airlineId cannot be an empty field`,
                            'any.required': `airlineId is a required field`
                        }),
            flightTime  : Joi.string().min(8).required().label('flightTime').messages({
                            'string.empty': `flightTime cannot be an empty field`,
                            'string.min': `flightTime should have a minimum length of {#limit}`,
                            'any.required': `flightTime is a required field`
                        }),
            arrivalTime  : Joi.string().min(8).required().label('arrivalTime').messages({
                            'string.empty': `arrivalTime cannot be an empty field`,
                            'string.min': `arrivalTime should have a minimum length of {#limit}`,
                            'any.required': `arrivalTime is a required field`
                        }),
            flightDate  : Joi.string().min(10).required().label('flightDate').messages({
                            'string.empty': `flightDate cannot be an empty field`,
                            'string.min': `flightDate should have a minimum length of {#limit}`,
                            'any.required': `flightDate is a required field`
                        }),
            arrivalDate  : Joi.string().min(10).required().label('arrivalDate').messages({
                            'string.empty': `arrivalDate cannot be an empty field`,
                            'string.min': `arrivalDate should have a minimum length of {#limit}`,
                            'any.required': `arrivalDate is a required field`
                        }),
            adultPx   : Joi.number().required().min(3).label('adultPx').messages({
                            'number.empty': `adultPx cannot be an empty field`,
                            'number.min': `adultPx should have a minimum length of {#limit}`,
                            'any.required': `adultPx is a required field`
                        }),
            childPx   : Joi.number().required().min(3).label('childPx').messages({
                            'number.empty': `childPx cannot be an empty field`,
                            'number.min': `childPx should have a minimum length of {#limit}`,
                            'any.required': `childPx is a required field`
                        }),
            babyPx   : Joi.number().required().min(3).label('babyPx').messages({
                            'number.empty': `babyPx cannot be an empty field`,
                            'number.min': `babyPx should have a minimum length of {#limit}`,
                            'any.required': `babyPx is a required field`
                        }),
            seatType  : Joi.string().min(3).required().label('seatType').messages({
                            'string.empty': `seatType cannot be an empty field`,
                            'string.min': `seatType should have a minimum length of {#limit}`,
                            'any.required': `seatType is a required field`
                        }),
            totalSeat   : Joi.number().required().label('totalSeat').messages({
                            'number.empty': `totalSeat cannot be an empty field`,
                            'any.required': `totalSeat is a required field`
                        }),
            baggage   : Joi.number().required().label('baggage').messages({
                            'number.empty': `baggage cannot be an empty field`,
                            'any.required': `baggage is a required field`
                        }),
            fromAirportId   : Joi.number().required().label('fromAirportId').messages({
                            'number.empty': `fromAirportId cannot be an empty field`,
                            'any.required': `fromAirportId is a required field`
                        }),
            toAirportId   : Joi.number().required().label('toAirportId').messages({
                            'number.empty': `toAirportId cannot be an empty field`,
                            'any.required': `toAirportId is a required field`
                        })
        });
        return await schema.validateAsync(data);
    }

    public async bookOrderValidation(data) {
        const passangers = Joi.object({
            title       : Joi.string().required().label('title').messages({
                            'string.empty': `title cannot be an empty field`,
                            'any.required': `title is a required field`
                        }),
            name        : Joi.string().required().label('name').messages({
                            'string.empty': `name cannot be an empty field`,
                            'any.required': `name is a required field`
                        }),
            noIdentity  : Joi.string().required().label('noIdentity').messages({
                            'string.empty': `noIdentity cannot be an empty field`,
                            'any.required': `noIdentity is a required field`
                        }),
            nation      : Joi.string().required().label('nation').messages({
                            'string.empty': `nation cannot be an empty field`,
                            'any.required': `nation is a required field`
                        }),
            age         : Joi.string().required().label('age').messages({
                            'string.empty': `age cannot be an empty field`,
                            'any.required': `age is a required field`
                        }),
            birthDate   : Joi.string().min(10).required().label('birthDate').messages({
                            'string.empty': `birthDate cannot be an empty field`,
                            'string.min': `birthDate should have a minimum length of {#limit}`,
                            'any.required': `birthDate is a required field`
                        })
        });

        const facilities = Joi.object({
            covidInsurance  : Joi.boolean().label('covidInsurance'),
            baggageInsurance: Joi.boolean().label('baggageInsurance'),
            fullProtection  : Joi.boolean().label('fullProtection')
        });

        const schema = Joi.object({
            passangers: Joi.array().items(passangers),
            facilities: facilities
        });

        return await schema.validateAsync(data);
    }

    public async checkoutValidation(data) {
        const address = Joi.object({
            city        : Joi.string().required().label('city').messages({
                            'string.empty': `city cannot be an empty field`,
                            'any.required': `city is a required field`
                        }),
            country     : Joi.string().max(2).required().label('country').messages({
                            'string.empty': `country cannot be an empty field`,
                            'string.max': `country should have a minimum length of {#limit}`,
                            'any.required': `country is a required field`
                        }),
            line1       : Joi.string().required().label('line1').messages({
                            'string.empty': `line1 cannot be an empty field`,
                            'any.required': `line1 is a required field`
                        }),
            line2       : Joi.string().required().label('line2').messages({
                            'string.empty': `line2 cannot be an empty field`,
                            'any.required': `line2 is a required field`
                        }),
            postal_code : Joi.string().required().label('postal_code').messages({
                            'string.empty': `postal_code cannot be an empty field`,
                            'any.required': `postal_code is a required field`
                        }),
            state       : Joi.string().required().label('state').messages({
                            'string.empty': `state cannot be an empty field`,
                            'any.required': `state is a required field`
                        })
        });

        const card = Joi.object({
            number      : Joi.string().min(10).max(16).required().label('number').messages({
                            'string.empty': `number cannot be an empty field`,
                            'string.min': `number should have a minimum length of {#limit}`,
                            'string.max': `number should have a minimum length of {#limit}`,
                            'any.required': `number is a required field`
                        }),
            exp_month   : Joi.number().required().label('exp_month').messages({
                            'number.empty': `exp_month cannot be an empty field`,
                            'any.required': `exp_month is a required field`
                        }),
            exp_year   : Joi.number().required().label('exp_year').messages({
                            'number.empty': `exp_year cannot be an empty field`,
                            'any.required': `exp_year is a required field`
                        }),
            cvc         : Joi.string().min(3).max(3).required().label('number').messages({
                            'string.empty': `number cannot be an empty field`,
                            'string.min': `number should have a minimum length of {#limit}`,
                            'string.max': `number should have a minimum length of {#limit}`,
                            'any.required': `number is a required field`
                        })
        });

        const schema = Joi.object({
            name    : Joi.string().required().label('name').messages({
                            'string.empty': `name cannot be an empty field`,
                            'any.required': `name is a required field`
                        }),
            address : address,
            email   : Joi.string().min(6).required().email().label('email').messages({
                            'string.empty': `email cannot be an empty field`,
                            'string.min': `email should have a minimum length of {#limit}`,
                            'any.required': `email is a required field`
                        }),
            card    : card
        });

        return await schema.validateAsync(data);
    }
}