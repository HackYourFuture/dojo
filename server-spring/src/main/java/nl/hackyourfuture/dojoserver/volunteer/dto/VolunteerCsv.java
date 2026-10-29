package nl.hackyourfuture.dojoserver.volunteer.dto;

import nl.hackyourfuture.dojoserver.shared.Csv;
import nl.hackyourfuture.dojoserver.volunteer.Volunteer;

import java.util.List;
import java.util.Map;

/** The volunteer export: every profile field, plus the number of active mentorships. */
public final class VolunteerCsv {
    private VolunteerCsv() {
    }

    public static String of(List<Volunteer> volunteers, Map<String, Long> activeMentorshipCounts) {
        List<Csv.Column<Volunteer>> columns = List.of(
                new Csv.Column<>("First name", Volunteer::getFirstName),
                new Csv.Column<>("Last name", Volunteer::getLastName),
                new Csv.Column<>("Gender", Volunteer::getGender),
                new Csv.Column<>("Pronouns", Volunteer::getPronouns),
                new Csv.Column<>("Company", Volunteer::getCompanyName),
                new Csv.Column<>("Job role", Volunteer::getJobRole),
                new Csv.Column<>("Email", Volunteer::getEmail),
                new Csv.Column<>("Phone", Volunteer::getPhone),
                new Csv.Column<>("Slack ID", Volunteer::getSlackId),
                new Csv.Column<>("GitHub handle", Volunteer::getGithubHandle),
                new Csv.Column<>("LinkedIn URL", Volunteer::getLinkedinUrl),
                new Csv.Column<>("Status", Volunteer::getStatus),
                new Csv.Column<>("Volunteer types", Volunteer::getVolunteerTypes),
                new Csv.Column<>("Expertise", Volunteer::getExpertise),
                new Csv.Column<>("Role preferences", Volunteer::getRolePreferences),
                new Csv.Column<>("Active mentorships",
                        volunteer -> activeMentorshipCounts.getOrDefault(volunteer.getId(), 0L)),
                new Csv.Column<>("Notes", Volunteer::getNotes));
        return Csv.of(columns, volunteers);
    }
}
