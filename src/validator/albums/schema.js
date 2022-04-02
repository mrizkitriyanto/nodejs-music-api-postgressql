const Joi = require('joi');

const AlbumPayloadsSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

module.exports = {AlbumPayloadsSchema};
