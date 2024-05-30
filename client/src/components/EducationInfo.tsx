import { useEffect, useState } from "react";
import { EducationInfoProps, TraineeEducationInfo } from "../types";
import { Box, Button, FormControl, Stack, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

export const EducationInfo = ({
  educationData,
  saveTraineeData,
}: EducationInfoProps) => {
  const [editedFields, setEditedFields] = useState<TraineeEducationInfo>(
    educationData!
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSaveClick = async () => {
    if (!editedFields || !educationData) return;

    const changedFields: Partial<TraineeEducationInfo> = {};
    Object.entries(editedFields).forEach(([key, value]) => {
      if (educationData[key as keyof TraineeEducationInfo] !== value) {
        changedFields[key as keyof TraineeEducationInfo] = value;
      }
    });

    const editedData: any = {
      contactInfo: {
        ...changedFields,
      },
    };

    setIsSaving(true);

    try {
      console.log("Saving trainee data:", editedData);
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
        <FormControl sx={{ mx: 2, my: 1, width: "15ch", gap: "2rem" }}>
          <TextField
            id="currentCohort"
            name="currentCohort"
            label="Cohort"
            value={editedFields?.currentCohort || ""}
            InputProps={{
              readOnly: isEditing ? false : true,
              inputProps: {
                min: 0,
              },
            }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? "outlined" : "standard"}
            onChange={handleChange}
          />
        </FormControl>
      </div>
      <div style={{ width: "100%" }}></div>
    </Box>
  );
};
