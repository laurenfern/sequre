const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const schema = {
  escrowId: Joi.objectId(),
  //  personId: Joi.objectId(),
  _id: Joi.objectId(),
  //  tenantId: Joi.object(),
  //  createdById: Joi.object(),
  //  sentDate: Joi.date(), //may need to change this property to "modifiedDate" when writing validation
  //  authorId: Joi.object(),
  //  authorRole: Joi.string(),
  //  authorFirst: Joi.string(),
  //  authorLast: Joi.string(),
  tenantId: Joi.object(),
  createdById: Joi.object(),
  modifiedById: Joi.object(),
  modifiedDate: Joi.date(),
  subject: Joi.string(),
  message: Joi.string(),
  selectedRecipients: Joi.string().allow(""),
  senderRoleCode: Joi.string()
};

module.exports = Joi.object().keys(schema);
