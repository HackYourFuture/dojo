import { useState } from "react";
import "./searchBarComponent.css"
import { FaSearch } from "react-icons/fa";

export const SearchBar = ({setResults}) => {
  const [input, setInput] = useState("");

  const fetchData = (value: string) => {
    // example api to get dummy data - [TODO]: replace with trainee api from BE
    fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json())
    .then((json) => {
      const results = json.filter((user) => { // [TODO]: create an interface for the expected response json
        return (
          // [TODO]: remove FE filtering after BE is ready
          value &&
          user && 
          user.name && 
          user.name.toLowerCase().includes(value)
        );
      });
      setResults(results);
    })
  }

  const handleChange = (value: string) => {
    setInput(value);
    fetchData(value)
  }

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input placeholder="Type to search..." value={input} onChange={(e) => handleChange(e.target.value)}/>
    </div>
  )
}