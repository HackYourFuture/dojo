import { Box, Button } from "@mui/material";
import { ProfileNavProps } from "../types";

export const ProfileNav = ({ activeTab, onTabChange }: ProfileNavProps) => {
  return (
    <Box display="flex" color="black" sx={{ mx: 5, my: 1 }}>
      <Button
        variant="contained"
        color={activeTab === "personal" ? "primary" : "inherit"}
        onClick={() => onTabChange("personal")}
        sx={{ marginRight: "8px" }}
      >
        Personal
      </Button>
      <Button
        variant="contained"
        color={activeTab === "contact" ? "primary" : "inherit"}
        onClick={() => onTabChange("contact")}
        sx={{ marginRight: "8px" }}
      >
        Contact
      </Button>
      <Button
        variant="contained"
        color={activeTab === "education" ? "primary" : "inherit"}
        onClick={() => onTabChange("education")}
        sx={{ marginRight: "8px" }}
      >
        Education
      </Button>
      <Button
        variant="contained"
        color={activeTab === "employment" ? "primary" : "inherit"}
        onClick={() => onTabChange("employment")}
        sx={{ marginRight: "8px" }}
      >
        Employment
      </Button>
    </Box>
  );
};
