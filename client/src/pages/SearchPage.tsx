import { useState } from "react";
import { SearchBar, SearchResultsList } from "../components";
import "./SearchPage.css";
import HYFLogo from "../assets/HYF_logo.svg";
import { Box } from "@mui/material";

export const SearchPage = () => {
  const [results, setResults] = useState("");

  function handleDataFromChild(data: string) {
    setResults(data);
  }

  return (
    <div className="App">
      <div className="search-bar-container">
        <Box sx={{ display: "flex" }}>
          <img src={HYFLogo} alt="HYF logo" className="hyf-logo-img" />
        </Box>
        <SearchBar data={handleDataFromChild} />
        {results && <SearchResultsList results={results} />}
      </div>
    </div>
  );
};
