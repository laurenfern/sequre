const responses = require("../models/responses");
const escrowMessagesService = require("../services/escrow.messages.service");
const apiPrefix = "/api/escrowMessages";

module.exports = {
  readAll: readAll,
  create: create,
  delete: _delete
};

function readAll(req, res) {
  //console.log("req.params is", req.params);
  //console.log("req.session is", req.session);
  escrowMessagesService
    .readAll(
      req.params.escrowId,
      req.session.passport.user.personId,
      req.session.passport.user._id
    )
    .then(messages => {
      const responseModel = new responses.ItemsResponse();
      responseModel.items = messages;
      res.json(responseModel);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}

function create(req, res) {
  const personId = req.session.passport.user.personId;
  req.model.fromPersonId = personId;
  escrowMessagesService
    .create(req.model)
    .then(data => {
      const responseModel = new responses.ItemResponse();
      responseModel.items = data;
      res
        .status(201)
        // .location(`${apiPrefix}/${data._id}`)
        .json(responseModel);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}

function _delete(req, res) {
  escrowMessagesService
    .delete(req.params.id)
    .then(() => {
      const responseModel = new responses.SuccessResponse();
      res.status(200).json(responseModel);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send(new responses.ErrorResponse(err));
    });
}
