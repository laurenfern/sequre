const mongodb = require("../mongodb.connection");
const conn = mongodb.connection;
const ObjectId = mongodb.ObjectId;
var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
  createCustomer,
  getAllInvoices,
  createInvoiceItem
};

function createCustomer(customer) {
  // Create a new customer
  return stripe.customers
    .create({
      email: customer.email,
      description: customer.name
    })
    .then(result => {
      return stripe.subscriptions
        .create({
          customer: result.id,
          items: [{ plan: "plan_Cus22hSJiJytgI" }],
          billing: "send_invoice",
          days_until_due: 30
        })
        .then(subcscription => {
          return conn
            .db()
            .collection("tenants")
            .updateOne(
              { _id: ObjectId(customer.tenantId) },
              { $set: { stripeId: result.id } }
            )
            .then(response => {
              return { id: result.id, description: result.description };
            });
        });
    });
}

function createInvoiceItem(id) {
  return stripe.invoiceItems
    .create({
      customer: id,
      amount: 500,
      currency: "usd",
      description: "Transaction Fee"
    })
    .then(result => {
      return result;
    })
    .catch(err => console.log(err));
}

function getAllInvoices(customerId) {
  return stripe.invoices.list({ customer: customerId });
}
