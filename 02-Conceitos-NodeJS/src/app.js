const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

const checkId = (request, response, next) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id == id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: "Not found"})
  }

  request.body.repositoryIndex = repositoryIndex;
  next();
} 

app.use(express.json());
app.use(cors());
app.use("/repositories/:id",checkId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repository = {id: uuid(), title, url, techs, likes: 0};

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {title, url, techs, repositoryIndex} = request.body;

  Object.assign(repositories[repositoryIndex], {title, url, techs});  

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const {repositoryIndex} = request.body;
  repositories.splice(repositoryIndex, 1);
  
  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const {repositoryIndex} = request.body;

  repositories[repositoryIndex].likes++;
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
