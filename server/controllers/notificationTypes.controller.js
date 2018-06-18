const responses = require("../models/responses");
const notificationTypesService = require("../services/notificationTypes.service");
const apiPrefix = "/api/notificationTypes";

module.exports = {
  readAll: readAll,
  readById: readById,
  create: create,
  update: update,
  delete: _delete
};

function readAll(req, res) {
  notificationTypesService
    .readAll()
    .then(notificationTypes => {
      res.json(new responses.ItemsResponse(notificationTypes));
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}

function readById(req, res) {
  notificationTypesService
    .readById(req.params.id)
    .then(notificationTypes => {
      res.json(new responses.ItemResponse(notificationTypes));
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}

function create(req, res) {
  notificationTypesService
    .create(req.body)
    .then(id => {
      res
        .status(201)
        .location(`${apiPrefix}/${id}`)
        .json(new responses.ItemResponse(id));
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}

function update(req, res) {
  notificationTypesService
    .update(req.params.id, req.body)
    .then(hacker => {
      res.status(200).json(new responses.SuccessResponse());
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}

function _delete(req, res) {
  notificationTypesService
    .delete(req.params.id)
    .then(() => {
      res.status(200).json(new responses.SuccessResponse());
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}
