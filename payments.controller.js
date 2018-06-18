const responses = require("../models/responses");
const paymentsService = require("../services/payments.service");
const apiPrefix = "/api/payments";

module.exports = {
  createCustomer,
  getAllInvoices,
  createInvoiceItem
};

function createCustomer(req, res) {
  paymentsService
    .createCustomer(req.body)
    .then(response => {
      const responseModel = new responses.ItemResponse();
      responseModel.item = response;
      res.status(201).json(responseModel);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}

function createInvoiceItem(req, res) {
  paymentsService
    .createInvoice(req.body)
    .then(response => {
      return response;
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}

function getAllInvoices(req, res) {
  paymentsService
    .getAllInvoices(req.params.stripeId)
    .then(response => {
      const responseModel = new responses.ItemResponse();
      responseModel.item = response;
      res.status(201).json(responseModel);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}
