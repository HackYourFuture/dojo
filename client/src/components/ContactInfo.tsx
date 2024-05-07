/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ContactData } from "../types";

interface ContactInfoProps {
  contactData?: ContactData;
  saveTraineeData: (editedData: ContactData) => void;
}

export const ContactInfo = ({
  contactData,
  saveTraineeData,
}: ContactInfoProps) => {
  const [editedFields, setEditedFields] = useState<ContactData>(contactData!);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (contactData) setEditedFields(contactData);
  }, [contactData]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const editedData: any = {};
    if (!editedFields || !contactData) return;
    Object.entries(editedFields).forEach(([key, value]) => {
      if (contactData && contactData[key as keyof ContactData] !== value) {
        editedData[key as keyof any] = value;
      }
    });
    saveTraineeData(editedData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  return (
    <Box display="flex" flexDirection="column" gap={4} padding="24px">
      <Box width={"100%"} display="flex" justifyContent={"end"}>
        {isEditing ? (
          <Button variant="contained" color="primary" onClick={handleSaveClick}>
            Save
          </Button>
        ) : (
          <Button variant="contained" onClick={handleEditClick}>
            Edit Profile
          </Button>
        )}
      </Box>
      <div style={{ width: "100%" }}>
        {/* Email */}
        <FormControl sx={{ mx: 2, my: 1, width: "80ch", gap: "2rem" }}>
          <InputLabel sx={{ color: "black" }} htmlFor="email">
            Email
          </InputLabel>
          <OutlinedInput
            id="email"
            name="email"
            label="Email"
            type="email"
            value={editedFields?.email || ""}
            onChange={handleChange}
            disabled={!isEditing}
            startAdornment=" "
          />
        </FormControl>

        {/* Slack */}
        <FormControl sx={{ mx: 2, my: 1, width: "80ch", gap: "2rem" }}>
          <InputLabel sx={{ color: "black" }} htmlFor="slack">
            Slack
          </InputLabel>
          <OutlinedInput
            id="slack"
            name="slack"
            label="Slack"
            type="text"
            value={editedFields?.slack || ""}
            onChange={handleChange}
            disabled={!isEditing}
            startAdornment=" "
          />
        </FormControl>

        {/* Phone */}
        <FormControl sx={{ mx: 2, my: 1, width: "80ch", gap: "2rem" }}>
          <InputLabel sx={{ color: "black" }} htmlFor="phone">
            Phone
          </InputLabel>
          <OutlinedInput
            id="phone"
            name="phone"
            label="Phone"
            type="tel"
            value={editedFields?.phone || ""}
            onChange={handleChange}
            disabled={!isEditing}
            startAdornment=" "
          />
        </FormControl>

        {/* Github Handle */}
        <FormControl sx={{ mx: 2, my: 1, width: "80ch", gap: "2rem" }}>
          <InputLabel sx={{ color: "black" }} htmlFor="githubHandle">
            Github Handle
          </InputLabel>
          <OutlinedInput
            id="githubHandle"
            name="githubHandle"
            label="Github Handle"
            type="text"
            value={editedFields?.githubHandle || ""}
            onChange={handleChange}
            disabled={!isEditing}
            startAdornment=" "
          />
        </FormControl>

        {/* Linkedin */}
        <FormControl sx={{ mx: 2, my: 1, width: "80ch", gap: "2rem" }}>
          <InputLabel sx={{ color: "black" }} htmlFor="linkedin">
            Linkedin
          </InputLabel>
          <OutlinedInput
            id="linkedin"
            name="linkedin"
            label="Linkedin"
            type="url"
            value={editedFields?.linkedin || ""}
            onChange={handleChange}
            disabled={!isEditing}
            startAdornment=" "
          />
        </FormControl>
      </div>
    </Box>
  );
};
