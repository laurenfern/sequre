const notificaticationType = require("../models/notificationType");
const mongodb = require("../mongodb.connection");
const conn = mongodb.connection;
const ObjectId = mongodb.ObjectId;

module.exports = {
  readAll: readAll,
  readById: readById,
  create: create,
  update: update,
  delete: _delete
};

function readAll() {
  return conn
    .db()
    .collection("notificationTypes")
    .find()
    .toArray()
    .then(types => {
      if (types) {
        return types.map(item => {
          item._id = item._id.toString();
          // in dog example, this is item.id=item._id.toString()
          return item;
        });
      }
      // If none found, return null
      return null;
    });
}

function readById(id) {
  return conn
    .db()
    .collection("notificationTypes")
    .findOne({ _id: new ObjectId(id) })
    .then(type => {
      if (type) {
        type._id = type._id.toString(); // convert ObjectId back to string
      }
      return type;
    });
}

function create(model) {
  return conn
    .db()
    .collection("notificationTypes")
    .insert(model)
    .then(result => result.insertedIds[0].toString()); // "return" generated Id as string
}

function update(id, doc) {
  // convert string id used outside of MongoDB into ObjectId needed by MongoDB
  //doc._id = new ObjectId(doc._id)
  delete doc._id;

  return conn
    .db()
    .collection("notificationTypes")
    .updateOne({ _id: new ObjectId(id) }, { $set: doc })
    .then(result => Promise.resolve()); // "return" nothing
}

function _delete(id) {
  return conn
    .db()
    .collection("notificationTypes")
    .deleteOne({ _id: new ObjectId(id) })
    .then(result => Promise.resolve()); // "return" nothing
}
