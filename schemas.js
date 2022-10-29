const Joi = require('joi');

module.exports.adventureSchema = Joi.object({
    place: Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
        location: Joi.string().required()
    }).required()
});