const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
// middleware
app.use(cors());
app.use(express.json());
//

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1nexttodo.slw58sb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const tasksCollection = client.db("NextToDo").collection("tasks");
    const completedTasksCollection = client
      .db("NextToDo")
      .collection("completed");

    //Get All Tasks Data
    app.get("/tasks", async (req, res) => {
      const query = {};
      const cursor = tasksCollection.find(query);
      const tasks = await cursor.toArray();
      res.send(tasks);
    });
    // Add Task
    app.post("/tasks", async (req, res) => {
      const newTaskInfo = req.body;
      const newTask = await tasksCollection.insertOne(newTaskInfo);
      res.send(newTask);
    });
    // Delete Task from My Task Collection
    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      console.log(req.params);
      const query = { _id: ObjectId(id) };
      console.log("my task collection query", query);
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
      console.log("deleting my task", id);
      console.log(result);
    });
    // Add Task to completed tasks collection
    app.put("/completed", async (req, res) => {
      const completedTaskInfo = req.body;
      const completedTask = await completedTasksCollection.insertOne(
        completedTaskInfo
      );
      res.send(completedTask);
    });
    //Get All Completed Tasks Data
    app.get("/completed", async (req, res) => {
      const query = {};
      const cursor = completedTasksCollection.find(query);
      const completedTasks = await cursor.toArray();
      res.send(completedTasks);
    });
    // Delete Task from My Completed Task Collection
    app.delete("/completed/:id", async (req, res) => {
      const id = req.params.id;
      console.log(req.params);
      const query = { _id: ObjectId(id) };
      console.log("query", query);
      const result = await completedTasksCollection.deleteOne(query);
      res.send(result);
      console.log("deleting from completed task", id);
      console.log(result);
    });
  } finally {
  }
}

run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("Next to do server is live");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
