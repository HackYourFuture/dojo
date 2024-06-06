/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useEffect, useState } from "react";
import { EducationInfoProps, Strike, TraineeEducationInfo } from "../types";
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
  Typography,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AddIcon from "@mui/icons-material/Add";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { LoadingButton } from "@mui/lab";

const NoIcon = () => null;

export const EducationInfo = ({
  educationData,
  saveTraineeData,
}: EducationInfoProps) => {
  const [editedFields, setEditedFields] = useState<TraineeEducationInfo>(
    educationData!
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingStrike, setIsAddingStrike] = useState(false);

  const [strikeFields, setStrikeFields] = useState<Strike>({
    id: "",
    date: "",
    reporterID: "",
    reason: "",
    comments: "",
  });

  useEffect(() => {
    if (educationData) setEditedFields(educationData as TraineeEducationInfo);
  }, [educationData]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    if (educationData) {
      setEditedFields(educationData);
    }
    setIsEditing(false);
  };

  const handleOpenStrike = () => {
    setIsAddingStrike(true);
  };

  const handleCancelOpenStrike = () => {
    if (educationData?.strikes) {
      setStrikeFields({
        id: "",
        date: "",
        reporterID: "",
        reason: "",
        comments: "",
      });
    }
    setIsAddingStrike(false);
  };

  const handleSaveClick = async () => {
    if (!editedFields || !educationData) return;

    const changedFields: Partial<TraineeEducationInfo> = {};
    Object.entries(editedFields).forEach(([key, value]) => {
      if (educationData[key as keyof TraineeEducationInfo] !== value) {
        changedFields[key as keyof TraineeEducationInfo] = value;
      }
    });

    const editedData: any = {
      educationInfo: {
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

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setEditedFields((prevFields) => ({
        ...prevFields,
        [name]: value,
      }));
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toISOString().split("T")[0];
  };

  const handleStrikeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStrikeFields((prevStrike) => ({
      ...prevStrike,
      [name]: value,
    }));
  };

  const handleStrikeSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setStrikeFields((prevStrike) => ({
      ...prevStrike,
      [name]: value,
    }));
  };

  // TODO: Add patching strike functionality when the API is ready.
  const handleAddStrike = async () => {};

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
        {/* Cohort */}
        <FormControl sx={{ mx: 2, my: 1, width: "11ch", gap: "2rem" }}>
          <TextField
            id="currentCohort"
            name="currentCohort"
            label="Cohort"
            value={editedFields?.currentCohort || ""}
            InputProps={{
              readOnly: isEditing ? false : true,
              inputMode: "numeric",
            }}
            inputProps={{
              pattern: "[0-9]*",
              maxLength: 3,
            }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? "outlined" : "standard"}
            onChange={handleNumericChange}
          />
        </FormControl>

        {/* Learning status */}
        <FormControl
          variant={isEditing ? "outlined" : "standard"}
          sx={{ mx: 2, my: 1, width: "20ch", gap: "2rem" }}
        >
          <InputLabel htmlFor="learningStatus">Learning status</InputLabel>
          <Select
            name="learningStatus"
            id="learningStatus"
            label="Learning status"
            value={editedFields?.learningStatus || ""}
            inputProps={{ readOnly: isEditing ? false : true }}
            IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value="studying">Studying</MenuItem>
            <MenuItem value="graduated">Graduated</MenuItem>
            <MenuItem value="on-hold">On hold</MenuItem>
            <MenuItem value="quit">Quit</MenuItem>
          </Select>
        </FormControl>

        {/* Quit date */}
        {editedFields?.learningStatus === "quit" && (
          <FormControl sx={{ mx: 2, my: 1, width: "20ch", gap: "2rem" }}>
            <TextField
              id={editedFields?.quitDate ? "quitDate" : "dateEmpty"}
              name="quitDate"
              label="Quit date"
              type="date"
              value={formatDate(editedFields?.quitDate)}
              InputProps={{ readOnly: isEditing ? false : true }}
              InputLabelProps={{ shrink: true }}
              variant={isEditing ? "outlined" : "standard"}
              onChange={handleChange}
            />
          </FormControl>
        )}

        {/* Quit reason */}
        {editedFields?.learningStatus === "quit" && (
          <FormControl
            variant={isEditing ? "outlined" : "standard"}
            sx={{ mx: 2, my: 1, width: "20ch", gap: "2rem" }}
          >
            <InputLabel htmlFor="quitReason">Quit reason</InputLabel>
            <Select
              name="quitReason"
              id="quitReason"
              label="Quit reason"
              value={editedFields?.quitReason || ""}
              inputProps={{ readOnly: isEditing ? false : true }}
              IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
              startAdornment=" "
              onChange={handleSelectChange}
            >
              <MenuItem value="technical">Technical</MenuItem>
              <MenuItem value="social-skills">Social skills</MenuItem>
              <MenuItem value="personal">Personal</MenuItem>
              <MenuItem value="municipality-or-monetary">
                Municipality or monetary
              </MenuItem>
              <MenuItem value="left-nl">Left NL</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Graduation date */}
        {editedFields?.learningStatus === "graduated" && (
          <FormControl sx={{ mx: 2, my: 1, width: "20ch", gap: "2rem" }}>
            <TextField
              id={editedFields?.graduationDate ? "graduationDate" : "dateEmpty"}
              name="graduationDate"
              label="Graduation date"
              type="date"
              value={formatDate(editedFields?.graduationDate)}
              InputProps={{ readOnly: isEditing ? false : true }}
              InputLabelProps={{ shrink: true }}
              variant={isEditing ? "outlined" : "standard"}
              onChange={handleChange}
            />
          </FormControl>
        )}
      </div>

      <div style={{ width: "100%" }}>
        {/* Start Cohort */}
        <FormControl sx={{ mx: 2, my: 1, width: "11ch", gap: "2rem" }}>
          <TextField
            id="startCohort"
            name="startCohort"
            label="Start cohort"
            value={editedFields?.startCohort || ""}
            InputProps={{
              readOnly: isEditing ? false : true,
              inputMode: "numeric",
            }}
            inputProps={{
              pattern: "[0-9]*",
              maxLength: 3,
            }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? "outlined" : "standard"}
            onChange={handleNumericChange}
          />
        </FormControl>

        {/* Start date */}
        <FormControl sx={{ mx: 2, my: 1, width: "20ch", gap: "2rem" }}>
          <TextField
            id={editedFields?.startDate ? "startDate" : "dateEmpty"}
            name="startDate"
            label="Start date"
            type="date"
            value={formatDate(editedFields?.startDate)}
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? "outlined" : "standard"}
            onChange={handleChange}
          />
        </FormControl>
      </div>

      <div style={{ width: "50%" }}>
        {/* Strikes */}
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6" color="black" padding="16px">
            Strikes ({editedFields?.strikes.length || 0})
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button startIcon={<AddIcon />} onClick={handleOpenStrike}>
              New strike
            </Button>
          </Stack>
        </Box>

        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
          }}
        >
          {editedFields?.strikes.map((strike, index) => (
            <React.Fragment key={strike.id}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={strike.date}
                disablePadding
                sx={{
                  paddingBottom: "16px",
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <HighlightOffIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={strike.reason}
                  secondary={strike.comments}
                />
              </ListItem>
              {index < editedFields?.strikes.length - 1 && (
                <Divider sx={{ color: "black" }} component="li" />
              )}
            </React.Fragment>
          ))}
        </List>

        <Modal
          open={isAddingStrike}
          onClose={handleCancelOpenStrike}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={isAddingStrike}>
            <Box
              component="form"
              display="flex"
              flexDirection="column"
              gap={2}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography variant="h6" mb={0.5}>
                Adding a strike:
              </Typography>
              <Box display="flex" flexDirection="row" gap={2}>
                <FormControl fullWidth>
                  <TextField
                    id={strikeFields?.date ? "date" : "dateEmpty"}
                    name="date"
                    label="Date"
                    type="date"
                    value={strikeFields.date}
                    InputLabelProps={{ shrink: true }}
                    onChange={handleStrikeChange}
                    fullWidth
                  />
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel htmlFor="reason">Reason</InputLabel>
                  <Select
                    name="reason"
                    id="reason"
                    label="Reason"
                    value={strikeFields.reason}
                    startAdornment=" "
                    onChange={handleStrikeSelectChange}
                  >
                    <MenuItem value="assignment">Assignment</MenuItem>
                    <MenuItem value="attendance">Attendance</MenuItem>
                    <MenuItem value="preparation">Preparation</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <FormControl fullWidth>
                <TextField
                  id="comments"
                  name="comments"
                  label="Comments"
                  type="text"
                  multiline
                  value={strikeFields.comments}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleStrikeChange}
                  fullWidth
                />
              </FormControl>
              <Box display="flex" flexDirection="row" gap={2}>
                <Button variant="contained" onClick={handleAddStrike} fullWidth>
                  Add Strike
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancelOpenStrike}
                  fullWidth
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
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
