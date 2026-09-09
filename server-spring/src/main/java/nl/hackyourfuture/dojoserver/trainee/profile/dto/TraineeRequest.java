package nl.hackyourfuture.dojoserver.trainee.profile.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import nl.hackyourfuture.dojoserver.trainee.profile.Background;
import nl.hackyourfuture.dojoserver.trainee.profile.EducationLevel;
import nl.hackyourfuture.dojoserver.trainee.profile.EnglishLevel;
import nl.hackyourfuture.dojoserver.trainee.profile.FinancialSupport;
import nl.hackyourfuture.dojoserver.trainee.profile.Gender;
import nl.hackyourfuture.dojoserver.trainee.profile.JobPath;
import nl.hackyourfuture.dojoserver.trainee.profile.LearningStatus;
import nl.hackyourfuture.dojoserver.trainee.profile.QuitReason;
import nl.hackyourfuture.dojoserver.trainee.profile.Track;
import nl.hackyourfuture.dojoserver.trainee.profile.Trainee;

import java.time.LocalDate;
import java.util.Locale;

@Schema(description = "The details of a trainee profile, as sent to create or update one")
public record TraineeRequest(
        // Personal
        @NotBlank
        @Size(min = 2, max = 100)
        @Schema(description = "The legal first name of the trainee.", example = "John")
        String firstName,

        @NotBlank
        @Size(min = 2, max = 100)
        @Schema(description = "The legal last name of the trainee.", example = "Doe")
        String lastName,

        @Size(min = 2, max = 100)
        @Schema(description = "The name the trainee prefers to be called.", example = "Johnny")
        String preferredName,

        @Schema(description = "How the trainee describes their gender.", example = "non-binary")
        Gender gender,

        @Size(min = 2, max = 100)
        @Schema(description = "The pronouns the trainee goes by. Free text, not a fixed list.",
                example = "They/them")
        String pronouns,

        @Past
        @Schema(description = "The date the trainee was born.", example = "1970-01-01")
        LocalDate dateOfBirth,

        @Size(min = 2, max = 100)
        @Schema(description = "The city the trainee lives in.", example = "Amsterdam")
        String location,

        @Schema(description = "How well the trainee speaks English.", example = "good")
        EnglishLevel englishLevel,

        @Schema(description = "Whether the trainee can work in a professional Dutch environment.",
                example = "true")
        Boolean professionalDutch,

        @Size(min = 3, max = 100)
        @Schema(description = "The country the trainee came from.", example = "Syria")
        String countryOfOrigin,

        @Schema(description = "The route by which the trainee came to the Netherlands.", example = "refugee")
        Background background,

        @PastOrPresent
        @Schema(description = "The date the trainee arrived in the Netherlands.", example = "2018-09-01")
        LocalDate nlArrivalDate,

        @PastOrPresent
        @Schema(description = "The date the trainee's first residence permit was issued.", example = "2019-02-15")
        LocalDate firstPermitIssueDate,

        @Schema(description = "How the trainee supports themselves while studying.", example = "uitkering")
        FinancialSupport financialSupport,

        @Schema(description = "The highest level of education the trainee completed.", example = "bachelors-degree")
        EducationLevel educationLevel,

        @Size(min = 3, max = 100)
        @Schema(description = "What the trainee studied.", example = "Biology")
        String educationBackground,

        @Min(0)
        @Max(80)
        @Schema(description = "How many hours a week the trainee does paid work while enrolled. 0 - means not working ",
                example = "16")
        Integer weeklyWorkHours,

        @Size(min = 3, max = 200)
        @Schema(description = "Anything to account for when catering a physical session.", example = "Vegetarian")
        String dietaryPreference,

        @Size(min = 3, max = 500)
        @Schema(description = "Anything to account for when hosting the trainee in person.",
                example = "Uses a wheelchair")
        String healthCondition,

        @Size(max = 5000)
        @Schema(description = "Free-form notes about the trainee.")
        String comments,

        @Size(min = 2, max = 50)
        @Schema(description = "The trainee's participant id for European Social Fund reporting.")
        String esfId,

        // Contact
        @NotBlank
        @Size(min = 3, max = 100)
        @Email
        @Schema(description = "The trainee Email. Must be unique across all trainees.",
                example = "john.doe@example.com")
        String email,

        @Size(min = 6, max = 50)
        @Schema(description = "The trainee's Slack member id.", example = "U068AQ9G99F")
        String slackId,

        @Size(min = 5, max = 30)
        @Schema(description = "A phone number the trainee can be reached on.", example = "+31612345678")
        String phone,

        @Size(min = 2, max = 50)
        @Schema(description = "The trainee's GitHub username, without the URL.", example = "johndoe")
        String githubHandle,

        @Size(min = 5, max = 200)
        @Schema(description = "The URL to the trainee's LinkedIn profile.",
                example = "https://linkedin.com/in/john-doe")
        String linkedinUrl,

        @Size(min = 2, max = 100)
        @Schema(description = "Who to contact in an emergency.", example = "Jane Doe")
        String emergencyContactName,

        @Size(min = 2, max = 50)
        @Schema(description = "How the emergency contact relates to the trainee.", example = "Sister")
        String emergencyContactRelationship,

        @Size(min = 5, max = 30)
        @Schema(description = "A phone number for the emergency contact.", example = "0687654321")
        String emergencyContactPhone,

        // Education
        @NotNull
        @Min(0)
        @Max(999)
        @Schema(description = "The cohort the trainee started the program with.", example = "52")
        Integer startCohort,

        @Min(0)
        @Max(999)
        @Schema(description = "The cohort the trainee currently studies with.", example = "53")
        Integer currentCohort,

        @NotNull
        @Schema(description = "The track the trainee is studying.", example = "core-program")
        Track track,

        @NotNull
        @Schema(description = "Where the trainee stands in the program.", example = "studying")
        LearningStatus learningStatus,

        @Schema(description = "The date the trainee started the program.", example = "2024-01-15")
        LocalDate startDate,

        @Schema(description = "The date the trainee graduated.", example = "2024-10-01")
        LocalDate graduationDate,

        @PastOrPresent
        @Schema(description = "The date the trainee left the program.", example = "2024-05-20")
        LocalDate quitDate,

        @Schema(description = "Why the trainee left the program.", example = "personal")
        QuitReason quitReason,

        @Size(min = 2, max = 100)
        @Schema(description = "The name of the trainee's tech mentor.", example = "Jane Roe")
        String mentorTech,

        @Size(min = 2, max = 100)
        @Schema(description = "The name of the trainee's HR mentor.", example = "Jane Roe")
        String mentorHr,

        @Size(min = 2, max = 100)
        @Schema(description = "The name of the trainee's English mentor.", example = "Jane Roe")
        String mentorEnglish,

        // Placement
        @NotNull
        @Schema(description = "Where the trainee stands in finding work.", example = "searching")
        JobPath jobPath,

        @Schema(description = "The date HackYourFuture stops supporting the trainee's job search.",
                example = "2025-10-01")
        LocalDate jobSupportEndDate,

        @Schema(description = "Whether the trainee has a car available for commuting.", example = "false")
        Boolean hasCar
) {

    public TraineeRequest {
        firstName = firstName == null ? null : firstName.strip();
        lastName = lastName == null ? null : lastName.strip();
        preferredName = preferredName == null ? null : preferredName.strip();
        pronouns = pronouns == null ? null : pronouns.strip();
        location = location == null ? null : location.strip();
        countryOfOrigin = countryOfOrigin == null ? null : countryOfOrigin.strip();
        educationBackground = educationBackground == null ? null : educationBackground.strip();
        dietaryPreference = dietaryPreference == null ? null : dietaryPreference.strip();
        healthCondition = healthCondition == null ? null : healthCondition.strip();
        comments = comments == null ? null : comments.strip();
        esfId = esfId == null ? null : esfId.strip();
        email = email == null ? null : email.strip().toLowerCase(Locale.ROOT);
        slackId = slackId == null ? null : slackId.strip();
        phone = phone == null ? null : phone.strip();
        githubHandle = githubHandle == null ? null : githubHandle.strip();
        linkedinUrl = linkedinUrl == null ? null : linkedinUrl.strip();
        emergencyContactName = emergencyContactName == null ? null : emergencyContactName.strip();
        emergencyContactRelationship =
                emergencyContactRelationship == null ? null : emergencyContactRelationship.strip();
        emergencyContactPhone = emergencyContactPhone == null ? null : emergencyContactPhone.strip();
        mentorTech = mentorTech == null ? null : mentorTech.strip();
        mentorHr = mentorHr == null ? null : mentorHr.strip();
        mentorEnglish = mentorEnglish == null ? null : mentorEnglish.strip();
    }

    public static TraineeRequest from(Trainee trainee) {
        return new TraineeRequest(
                trainee.getFirstName(),
                trainee.getLastName(),
                trainee.getPreferredName(),
                trainee.getGender(),
                trainee.getPronouns(),
                trainee.getDateOfBirth(),
                trainee.getLocation(),
                trainee.getEnglishLevel(),
                trainee.getProfessionalDutch(),
                trainee.getCountryOfOrigin(),
                trainee.getBackground(),
                trainee.getNlArrivalDate(),
                trainee.getFirstPermitIssueDate(),
                trainee.getFinancialSupport(),
                trainee.getEducationLevel(),
                trainee.getEducationBackground(),
                trainee.getWeeklyWorkHours(),
                trainee.getDietaryPreference(),
                trainee.getHealthCondition(),
                trainee.getComments(),
                trainee.getEsfId(),
                trainee.getEmail(),
                trainee.getSlackId(),
                trainee.getPhone(),
                trainee.getGithubHandle(),
                trainee.getLinkedinUrl(),
                trainee.getEmergencyContactName(),
                trainee.getEmergencyContactRelationship(),
                trainee.getEmergencyContactPhone(),
                trainee.getStartCohort(),
                trainee.getCurrentCohort(),
                trainee.getTrack(),
                trainee.getLearningStatus(),
                trainee.getStartDate(),
                trainee.getGraduationDate(),
                trainee.getQuitDate(),
                trainee.getQuitReason(),
                trainee.getMentorTech(),
                trainee.getMentorHr(),
                trainee.getMentorEnglish(),
                trainee.getJobPath(),
                trainee.getJobSupportEndDate(),
                trainee.getHasCar());
    }
}
