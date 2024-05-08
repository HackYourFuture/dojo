import { useState } from "react";
import "./searchBarComponent.css";
import { TextField, Box } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SearchBar = ({ data }: any) => {
  const [input, setInput] = useState("");

  const handleChange = (value: string) => {
    setInput(value);
    data(value);
  };

  return (
    <div className="input-wrapper">
      <Box sx={{ display: "flex", width: 1 }}>
        <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.4 }} />
        <TextField
          variant="standard"
          placeholder="Search trainee..."
          fullWidth
          autoFocus
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          InputProps={{ disableUnderline: true }}
        />
      </Box>
    </div>
  );
};
