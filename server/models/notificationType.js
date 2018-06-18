const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const schema = {
  name: Joi.string()
    .min(3)
    .max(50)
    .required(),
  _id: Joi.objectId().allow(""),
  code: Joi.string()
    .min(3)
    .max(10)
    .required()
    .error(() => "code must be a minimum of 3 and maximum of 7 letters"),
  documentType: Joi.string(),
  displayOrder: Joi.number()
    .integer()
    .required(),
  isObsolete: Joi.boolean(),
  tenantId: Joi.object(),
  createdById: Joi.object(),
  modifiedById: Joi.object(),
  modifiedDate: Joi.date()
};

module.exports = Joi.object().keys(schema);
