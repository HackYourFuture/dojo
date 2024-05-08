import "./SearchResultsList.css";
import { SearchResult, SearchResultsListProps } from "../types";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { useTraineeSearchData } from "../hooks/useTraineeSearchData";
import { useDebounce } from "../hooks/useDebounce";
import AlertTitle from "@mui/material/AlertTitle";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemButton } from "@mui/material";

export const SearchResultsList = ({ results }: SearchResultsListProps) => {
  // You can change search debounce time using this hook.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const debouncedSearchTerm: any = useDebounce(results, 400);

  const { isLoading, data, isError, error, isFetching } =
    useTraineeSearchData(debouncedSearchTerm);

  if (isLoading || isFetching) {
    return (
      <Box p={4} sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError && error instanceof Error) {
    return (
      <Box p={4} sx={{ width: "100%" }}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: 300,
        bgcolor: "background.paper",
        overflowY: "scroll",
        borderRadius: "10px",
      }}
    >
      {data.length ? (
        <List>
          {data.map((trainee: SearchResult) => {
            return (
              <ListItem disablePadding>
                <Link
                  to={`/trainee/${trainee.name.replace(/ /g, "-")}_${
                    trainee.id
                  }`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                >
                  <ListItemButton key={trainee.id}>
                    {trainee.name}
                  </ListItemButton>
                </Link>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Alert severity="info" sx={{ bgcolor: "background.paper" }}>
          No results found!
        </Alert>
      )}
    </Box>
  );
};
