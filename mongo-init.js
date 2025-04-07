// Switch to the finance-app database
db = db.getSiblingDB('finance-app');

// Create application user with exact password matching your environment
db.createUser({
  user: "finance-app-user",
  pwd: "bjkwjewg0'13£!Abc",
  roles: [
    {
      role: "readWrite",
      db: "finance-app"
    }
  ]
});

// Create some initial test data if needed
// Default categories
db.categories.insertMany([
  {
    name: "Stipendio",
    type: "income",
    userId: ObjectId("000000000000000000000001")
  },
  {
    name: "Consulenza",
    type: "income",
    userId: ObjectId("000000000000000000000001")
  },
  {
    name: "Affitto",
    type: "expense",
    userId: ObjectId("000000000000000000000001")
  },
  {
    name: "Spesa",
    type: "expense",
    userId: ObjectId("000000000000000000000001")
  },
  {
    name: "Bollette",
    type: "expense",
    userId: ObjectId("000000000000000000000001")
  },
  {
    name: "Trasporti",
    type: "expense",
    userId: ObjectId("000000000000000000000001")
  }
]);

print("MongoDB initialization completed");