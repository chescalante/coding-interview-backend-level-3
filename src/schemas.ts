import Joi from "joi";

export const payloadItemSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().positive().required().messages({ "number.positive": "\"price\" cannot be negative"}),
}).required();

export const paramsIDSchema = Joi.object({
    id: Joi.number().integer().min(1).required()
})