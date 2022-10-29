const Joi = require('joi');

module.exports.adventureSchema = Joi.object({
    places: Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
        location: Joi.string().required()
    }).required()
});