/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useEffect, useState } from "react";
import { EmploymentInfoProps, JobPath, TraineeEmploymentInfo } from "../types";
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
import { LoadingButton } from "@mui/lab";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LinkIcon from "@mui/icons-material/Link";

const NoIcon = () => null;


/**
 * Component for displaying trainee profile data on the employment information tab.
 *
 * @param {TraineeEmploymentInfo} employmentData trainee employment information.
 * @param {TraineeEmploymentInfo} saveTraineeData callback to save edited trainee employment information.
 * @returns {ReactNode} A React element that renders trainee employment information with view, add, and edit logic.
 */
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

  /**
   * Function to enable edit mode when edit button is clicked.
   */
  const handleEditClick = () => {
    setIsEditing(true);
  };

  /**
   * Function to set editing mode to `false` when cancel button is clicked.
   */
  const handleCancelClick = () => {
    if (employmentData) {
      setEditedFields(employmentData);
    }
    setIsEditing(false);
  };

  /**
   * Function to handel the saving logic after clicking the save button.
   */
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

  /**
   * Function to handel changing text fields with edited data.
   * 
   * @param {HTMLInputElement} e the event received from the text fields after editing.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedFields((prevFields) => ({
      ...prevFields,
      [name]: name === "date" ? new Date(value) : value,
    }));
  };

  /**
   * Function to handel changing select fields with edited data.
   * 
   * @param {SelectChangeEvent} event the event received from select component change.
   */
  const handleSelectChange = (
    event: SelectChangeEvent<
      string | boolean | { name?: string; value: ReactNode }
    >
  ) => {
    const { name, value } = event.target;
    setEditedFields((prevFields) => ({
      ...prevFields,
      [name]: value === "true" ? true : value === "false" ? false : value,
    }));
  };

  /**
   * Function to format date value.
   * 
   * @param {Date | undefined} date date value selected.
   */
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    const formattedDate = new Date(date);
    if (isNaN(formattedDate.getTime())) {
      return date.toString();
    }
    return formattedDate.toISOString().split("T")[0];
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
            <MenuItem value={JobPath.NotGraduated}>Not graduated</MenuItem>
            <MenuItem value={JobPath.Searching}>Searching</MenuItem>
            <MenuItem value={JobPath.Internship}>Internship</MenuItem>
            <MenuItem value={JobPath.TechJob}>Tech job</MenuItem>
            <MenuItem value={JobPath.NonTechJob}>Non tech job</MenuItem>
            <MenuItem value={JobPath.NotSearching}>Not searching</MenuItem>
            <MenuItem value={JobPath.OtherStudies}>Other studies</MenuItem>
            <MenuItem value={JobPath.NoLongerHelping}>
              No longer helping
            </MenuItem>
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
                secondaryAction={formatDate(employmentHistory.startDate)}
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
