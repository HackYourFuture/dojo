import { useState } from "react";
import { Search, SearchResultsList } from "../components";
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
        <Search data={handleDataFromChild} />
        {results && <SearchResultsList results={results} />}
      </div>
    </div>
  );
};
