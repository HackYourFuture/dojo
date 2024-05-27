import { useEffect, useState } from "react";
import { EducationInfoProps, TraineeEducationInfo } from "../types";
import { Typography } from "@mui/material";

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
    <Typography variant="h6" color="black" padding="24px">
      Education Info
    </Typography>
  );
};
