import Joi from 'joi';

// User registration schema
export const userSchema = Joi.object({
    name: Joi.string().required().min(3).max(100),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    whatsappNumber: Joi.string().required().pattern(/^\(\d{2}\) \d{5}-\d{4}$/),
    zipcode: Joi.string().required().pattern(/^\d{5}-\d{3}$/),
    cpf: Joi.string().required().pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
    dateOfBirth: Joi.date().required().max('now').iso(),
});

// Login schema
export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// Event schema
export const eventSchema = Joi.object({
    title: Joi.string().required().min(3).max(100),
    date: Joi.string().required(),
    time: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    imageUrl: Joi.string().uri().required(),
    ticketLink: Joi.string().uri().allow(null),
    isPast: Joi.boolean().default(false),
    status: Joi.string().valid('sold-out', 'available', 'coming-soon').default('coming-soon'),
    price: Joi.number().allow(null),
    djs: Joi.array().items(Joi.string())
});

// DJ schema
export const djSchema = Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().required(),
    image: Joi.string().uri().required(),
    soundcloud: Joi.string().uri().allow(null),
    trackId: Joi.string().allow(null),
    genres: Joi.array().items(Joi.string()).required()
});

// Ticket schema
export const ticketSchema = Joi.object({
    eventId: Joi.string().required(),
    buyerName: Joi.string().required(),
    buyerEmail: Joi.string().email().required(),
    buyerCpf: Joi.string().required().pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
    price: Joi.number().required(),
    paymentMethod: Joi.string().required()
});

// Helper function to validate using Joi
export const validateWithJoi = (data: any, schema: Joi.ObjectSchema) => {
    return schema.validate(data, { abortEarly: false });
}; 