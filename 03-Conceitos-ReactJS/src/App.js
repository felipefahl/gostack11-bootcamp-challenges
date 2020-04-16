import React, {useEffect, useState} from "react";

import api from './services/api';
import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories')
      .then(response => {
        setRepositories(response.data);
      })
    }, []);

  async function handleAddRepository() {
    try {
      const repository = {
        title: "New repo", 
        url: "repo.com.br", 
        techs: [
          "ReactJs",
          "ReactiveNative",
          "JavaScript"
        ]
      };
      const response = await api.post('repositories', repository);    
      setRepositories([...repositories, response.data]);
    } catch(err) {
      alert(`Erro: Tente novamente mais tarde`)
    }
  }

  async function handleRemoveRepository(id) {
    try {
      await api.delete(`repositories/${id}`);
      setRepositories(repositories.filter(repository => repository.id !== id));
    } catch(err) {
      alert(`Erro: Tente novamente mais tarde`)
    }
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository => (
          <li key={repository.id}>
            {repository.title}
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
