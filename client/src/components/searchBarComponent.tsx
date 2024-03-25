import { useState } from "react";
import "./searchBarComponent.css"
import { FaSearch } from "react-icons/fa";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SearchBar = ({data}: any) => {
  const [input, setInput] = useState("");

  const handleChange = (value: string) => {
    setInput(value);
    data(value);
  }

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input type="search" placeholder="Type to search..." value={input} onChange={(e) => handleChange(e.target.value)}/>
    </div>
  )
}