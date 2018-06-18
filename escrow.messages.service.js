const mongodb = require("../mongodb.connection");
const conn = mongodb.connection;
const ObjectId = mongodb.ObjectId;

module.exports = {
  readAll: readAll,
  create: create,
  delete: _delete
};

function readAll(escrowId, personId, userId) {
  const id = escrowId;
  return conn
    .db()
    .collection("escrowMessages")
    .aggregate()
    .match({
      escrowId: id,
      $or: [
        { "selectedRecipients.personId": ObjectId(personId) },
        { createdById: ObjectId(userId) }
        // if we want MA and TA to see all messages in an Escrow, add
        // ,{taId: objectId("userId of taId for that escrow") }
        // this requires that taId and maId be added to the escrow Object and each messageObject
      ]
    })
    .sort({
      modifiedDate: -1
    })
    .toArray()
    .then(messages => {
      if (messages) {
        return messages.map(item => {
          item.createdDate = item._id.getTimestamp();
          item._id = item._id.toString();

          return item;
        });
      }
      return null;
    });
}

function create(model) {
  // model.personId = ObjectId(model.personId);
  //model.escrowId = ObjectId(model.escrowId);
  model.selectedRecipients = model.selectedRecipients.split(",").map(s => {
    const parts = s.split("|");
    return {
      securityRoleId: ObjectId(parts[0]),
      personId: ObjectId(parts[1])
    };
  });
  return (
    conn
      .db()
      .collection("people")
      //need to match this to people array in activeEscrowInfo, not to people collection.
      .findOne({ _id: ObjectId(model.fromPersonId) })
      .then(response => {
        console.log("response from create  backend", response);
        const senderName = response.firstName + " " + response.lastName;
        model.senderName = senderName;
        return conn
          .db()
          .collection("escrowMessages")
          .insert(model)
          .then(result => {
            return {
              _id: result.insertedIds[0].toString(),
              senderName: senderName
              //senderRole: senderRole
            };
          });
        // "return" generated Id as string.  Change to ObjectId?
      })
  );
}

function _delete(id) {
  return conn
    .db()
    .collection("escrowMessages")
    .deleteOne({ _id: new ObjectId(id) })
    .then(result => Promise.resolve()); // "return" nothing
}
