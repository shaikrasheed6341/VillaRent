const joi = require('joi')

module.exports.reviewschema =  joi.object({
    review:joi.object({
        rateing : joi.number().required(),
        Comment : joi.string().required() 
    }).required()
})