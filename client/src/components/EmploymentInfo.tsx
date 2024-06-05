/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useEffect, useState } from "react";
import { TraineeEmploymentInfo } from "../types";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  InputAdornment,
  Link,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LinkIcon from "@mui/icons-material/Link";

interface EmploymentInfoProps {
  employmentData?: TraineeEmploymentInfo;
  saveTraineeData: (editedData: TraineeEmploymentInfo) => void;
}

const NoIcon = () => null;

export const EmploymentInfo = ({
  employmentData,
  saveTraineeData,
}: EmploymentInfoProps) => {
  const [editedFields, setEditedFields] = useState<TraineeEmploymentInfo>(
    employmentData!
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (employmentData)
      setEditedFields(employmentData as TraineeEmploymentInfo);
  }, [employmentData]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    if (employmentData) {
      setEditedFields(employmentData);
    }
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    if (!editedFields || !employmentData) return;

    const changedFields: Partial<TraineeEmploymentInfo> = {};
    Object.entries(editedFields).forEach(([key, value]) => {
      if (employmentData[key as keyof TraineeEmploymentInfo] !== value) {
        changedFields[key as keyof TraineeEmploymentInfo] = value;
      }
    });

    const editedData: any = {
      employmentInfo: {
        ...changedFields,
      },
    };

    setIsSaving(true);

    try {
      await saveTraineeData(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving trainee data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleSelectChange = (
    event: SelectChangeEvent<
      string | boolean | { name?: string; value: ReactNode }
    >
  ) => {
    const { name, value } = event.target;
    setEditedFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      gap={4}
      padding="24px"
    >
      <Box width={"100%"} display="flex" justifyContent={"end"}>
        <Stack direction="row" spacing={2}>
          <LoadingButton
            color="primary"
            onClick={isEditing ? handleSaveClick : handleEditClick}
            loading={isSaving}
            variant="contained"
          >
            <span>{isEditing ? "Save" : "Edit profile"}</span>
          </LoadingButton>
          {isEditing && <Button onClick={handleCancelClick}>Cancel</Button>}
        </Stack>
      </Box>

      <div style={{ width: "100%" }}>
        {/* Job path */}
        <FormControl
          variant={isEditing ? "outlined" : "standard"}
          sx={{ mx: 2, my: 1, width: "20ch", gap: "2rem" }}
        >
          <InputLabel htmlFor="jobPath">Job path</InputLabel>
          <Select
            name="jobPath"
            id="jobPath"
            label="Job path"
            value={editedFields?.jobPath || ""}
            inputProps={{ readOnly: isEditing ? false : true }}
            IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value="not-graduated">Not graduated</MenuItem>
            <MenuItem value="searching">Searching</MenuItem>
            <MenuItem value="internship">Internship</MenuItem>
            <MenuItem value="tech-job">Tech job</MenuItem>
            <MenuItem value="non-tech-job">Non tech job</MenuItem>
            <MenuItem value="not-searching">Not searching</MenuItem>
            <MenuItem value="other-studies">Other studies</MenuItem>
            <MenuItem value="no-longer-helping">No longer helping</MenuItem>
          </Select>
        </FormControl>

        {/* CV */}
        <FormControl sx={{ mx: 2, my: 1, width: "30ch", gap: "2rem" }}>
          <TextField
            id="cvURL"
            name="cvURL"
            label="CV"
            type="url"
            value={editedFields?.cvURL || ""}
            InputProps={{
              readOnly: isEditing ? false : true,
              endAdornment: (
                <InputAdornment position="start">
                  {!isEditing && editedFields?.cvURL && (
                    <Link href={editedFields?.cvURL} target="_blank">
                      <LinkIcon sx={{ color: "action.active" }} />
                    </Link>
                  )}
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              shrink: true,
            }}
            variant={isEditing ? "outlined" : "standard"}
            onChange={handleChange}
          />
        </FormControl>
      </div>

      <div style={{ width: "100%" }}>
        {/* Availability */}
        <FormControl sx={{ mx: 2, width: "30ch" }}>
          <TextField
            id="availability"
            name="availability"
            label="Availability"
            type="text"
            value={editedFields?.availability || ""}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? "outlined" : "standard"}
            onChange={handleChange}
          />
        </FormControl>
      </div>

      <div style={{ width: "100%" }}>
        {/* Preferred role */}
        <FormControl sx={{ mx: 2, width: "30ch" }}>
          <TextField
            id="preferredRole"
            name="preferredRole"
            label="Preferred role"
            type="text"
            value={editedFields?.preferredRole || ""}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? "outlined" : "standard"}
            onChange={handleChange}
          />
        </FormControl>

        {/* Preferred location */}
        <FormControl sx={{ mx: 2, width: "30ch" }}>
          <TextField
            id="preferredLocation"
            name="preferredLocation"
            label="Preferred location"
            type="text"
            value={editedFields?.preferredLocation || ""}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? "outlined" : "standard"}
            onChange={handleChange}
          />
        </FormControl>

        {/* Driving license */}
        <FormControl
          variant={isEditing ? "outlined" : "standard"}
          sx={{ mx: 2, width: "14ch" }}
        >
          <InputLabel htmlFor="drivingLicense">Driving license</InputLabel>
          <Select
            name="drivingLicense"
            id="drivingLicense"
            label="Driving license"
            value={
              editedFields?.drivingLicense == null
                ? ""
                : editedFields?.drivingLicense
            }
            inputProps={{ readOnly: isEditing ? false : true }}
            IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div style={{ width: "100%" }}>
        {/* Extra technologies */}
        <FormControl sx={{ mx: 2, width: "30ch" }}>
          <TextField
            id="extraTechnologies"
            name="extraTechnologies"
            label="Extra technologies"
            type="text"
            value={editedFields?.extraTechnologies || ""}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? "outlined" : "standard"}
            onChange={handleChange}
          />
        </FormControl>
      </div>

      <div style={{ width: "100%" }}>
        {/* Employment history */}
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6" color="black" padding="16px">
            Employment history ({editedFields?.employmentHistory.length || 0})
          </Typography>
        </Box>

        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
          }}
        >
          {editedFields?.employmentHistory.map((employmentHistory, index) => (
            <React.Fragment key={employmentHistory.id}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={employmentHistory.startDate}
                disablePadding
                sx={{
                  paddingBottom: "16px",
                }}
              >
                <ListItemText
                  primary={`${employmentHistory.role} at ${employmentHistory.companyName} (${employmentHistory.type})`}
                  secondary={employmentHistory.comments}
                />
              </ListItem>
              {index < editedFields?.employmentHistory.length - 1 && (
                <Divider sx={{ color: "black" }} component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      </div>

      <div style={{ width: "100%" }}>
        {/* Comments */}
        <FormControl sx={{ mx: 2, width: "81ch" }}>
          <TextField
            id="comments"
            name="comments"
            label="Comments"
            type="text"
            multiline
            value={editedFields?.comments || ""}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? "outlined" : "standard"}
            onChange={handleChange}
          />
        </FormControl>
      </div>
    </Box>
  );
};
