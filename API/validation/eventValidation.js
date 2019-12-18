const Joi = require("@hapi/joi");

const eventValidation = data => {
  const schema = {
    category: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    address: Joi.string().required(),
    details: Joi.string().required(),
    event_date: Joi.date()
      .greater("now")
      .required(),
    image: Joi.string()
  };
  return Joi.validate(data, schema);
};

module.exports.eventValidation = eventValidation;
