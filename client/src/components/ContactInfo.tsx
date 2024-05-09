import { Box, Button, FormControl, Icon, Link, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { ContactData } from "../types";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import PhoneIcon from "@mui/icons-material/Phone";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import slackIcon from "../assets/slack.png";

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
    if (contactData) setEditedFields(contactData as ContactData);
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <EmailIcon sx={{ color: "action.active", mr: 1 }} />
          <Link href={"mailto:" + editedFields?.email}>
            <FormControl
              sx={{
                mx: 2,
                my: 2,
                width: "80ch",
                gap: "2rem",
              }}
            >
              <TextField
                id="email"
                name="email"
                label="Email"
                type="email"
                value={editedFields?.email || ""}
                InputProps={{
                  readOnly: isEditing ? false : true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant={isEditing ? "outlined" : "standard"}
                onChange={handleChange}
              />
            </FormControl>
          </Link>
        </Box>

        {/* Slack */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Icon sx={{ mr: 1 }}>
            <img src={slackIcon} alt="Slack" width="27" height="27" />
          </Icon>
          <FormControl
            sx={{
              mx: 2,
              my: 2,
              width: "80ch",
              gap: "2rem",
            }}
          >
            <TextField
              id="slack"
              name="slack"
              label="Slack"
              type="text"
              value={editedFields?.slack || ""}
              InputProps={{
                readOnly: isEditing ? false : true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant={isEditing ? "outlined" : "standard"}
              onChange={handleChange}
            />
          </FormControl>
        </Box>

        {/* Phone */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <PhoneIcon sx={{ color: "action.active", mr: 1 }} />
          <Link href={"tel:" + editedFields?.phone}>
            <FormControl
              sx={{
                mx: 2,
                my: 2,
                width: "80ch",
                gap: "2rem",
              }}
            >
              <TextField
                id="phone"
                name="phone"
                label="Phone"
                type="tel"
                value={editedFields?.phone || ""}
                InputProps={{
                  readOnly: isEditing ? false : true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant={isEditing ? "outlined" : "standard"}
                onChange={handleChange}
              />
            </FormControl>
          </Link>
        </Box>

        {/* Github Handle */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <GitHubIcon sx={{ color: "action.active", mr: 1 }} />
          <Link
            href={"https://github.com/" + editedFields?.githubHandle}
            target="_blank"
          >
            <FormControl
              sx={{
                mx: 2,
                my: 2,
                width: "80ch",
                gap: "2rem",
              }}
            >
              <TextField
                id="githubHandle"
                name="githubHandle"
                label="Github Handle"
                type="text"
                value={editedFields?.githubHandle || ""}
                InputProps={{
                  readOnly: isEditing ? false : true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant={isEditing ? "outlined" : "standard"}
                onChange={handleChange}
              />
            </FormControl>
          </Link>
        </Box>

        {/* Linkedin */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <LinkedInIcon sx={{ color: "action.active", mr: 1 }} />
          <Link href={editedFields?.linkedin} target="_blank">
            <FormControl
              sx={{
                mx: 2,
                my: 2,
                width: "80ch",
                gap: "2rem",
              }}
            >
              <TextField
                id="linkedin"
                name="linkedin"
                label="Linkedin"
                type="url"
                value={editedFields?.linkedin || ""}
                InputProps={{
                  readOnly: isEditing ? false : true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant={isEditing ? "outlined" : "standard"}
                onChange={handleChange}
              />
            </FormControl>
          </Link>
        </Box>
      </div>
    </Box>
  );
};
