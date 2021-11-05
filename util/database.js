const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://anantduhan:Sapna-0911@realkart.ciloc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected to MongoDB");
      callback(client);
    })
    .catch((err) => {
      console.log(err);
    });
 
}

module.exports = mongoConnect;