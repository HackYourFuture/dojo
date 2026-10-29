package nl.hackyourfuture.dojoserver.trainee.profile.dto;

import nl.hackyourfuture.dojoserver.shared.Csv;
import nl.hackyourfuture.dojoserver.trainee.profile.Trainee;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/** The trainee export: every profile field but the health condition, the diet and the emergency contact. */
public final class TraineeCsv {
    private TraineeCsv() {
    }

    public static String of(List<Trainee> trainees, Map<String, BigDecimal> averageScores) {
        List<Csv.Column<Trainee>> columns = List.of(
                new Csv.Column<>("First name", Trainee::getFirstName),
                new Csv.Column<>("Last name", Trainee::getLastName),
                new Csv.Column<>("Preferred name", Trainee::getPreferredName),
                new Csv.Column<>("Gender", Trainee::getGender),
                new Csv.Column<>("Pronouns", Trainee::getPronouns),
                new Csv.Column<>("Date of birth", Trainee::getDateOfBirth),
                new Csv.Column<>("Email", Trainee::getEmail),
                new Csv.Column<>("Phone", Trainee::getPhone),
                new Csv.Column<>("Slack ID", Trainee::getSlackId),
                new Csv.Column<>("GitHub handle", Trainee::getGithubHandle),
                new Csv.Column<>("LinkedIn URL", Trainee::getLinkedinUrl),
                new Csv.Column<>("City", trainee -> trainee.getCity() == null ? null : trainee.getCity().getName()),
                new Csv.Column<>("Province",
                        trainee -> trainee.getCity() == null ? null : trainee.getCity().getProvince()),
                new Csv.Column<>("Country of origin", Trainee::getCountryOfOrigin),
                new Csv.Column<>("Background", Trainee::getBackground),
                new Csv.Column<>("NL arrival date", Trainee::getNlArrivalDate),
                new Csv.Column<>("First permit issue date", Trainee::getFirstPermitIssueDate),
                new Csv.Column<>("English level", Trainee::getEnglishLevel),
                new Csv.Column<>("Professional Dutch", Trainee::getProfessionalDutch),
                new Csv.Column<>("Financial support", Trainee::getFinancialSupport),
                new Csv.Column<>("Education level", Trainee::getEducationLevel),
                new Csv.Column<>("Education background", Trainee::getEducationBackground),
                new Csv.Column<>("Weekly work hours", Trainee::getWeeklyWorkHours),
                new Csv.Column<>("Has car", Trainee::getHasCar),
                new Csv.Column<>("Start cohort", Trainee::getStartCohort),
                new Csv.Column<>("Current cohort", Trainee::getCurrentCohort),
                new Csv.Column<>("Track", Trainee::getTrack),
                new Csv.Column<>("Learning status", Trainee::getLearningStatus),
                new Csv.Column<>("Start date", Trainee::getStartDate),
                new Csv.Column<>("Graduation date", Trainee::getGraduationDate),
                new Csv.Column<>("Certificate ID", Trainee::getCertificateId),
                new Csv.Column<>("Quit date", Trainee::getQuitDate),
                new Csv.Column<>("Quit reason", Trainee::getQuitReason),
                new Csv.Column<>("Job path", Trainee::getJobPath),
                new Csv.Column<>("Job support end date", Trainee::getJobSupportEndDate),
                new Csv.Column<>("Average assessment score", trainee -> averageScores.get(trainee.getId())),
                new Csv.Column<>("ESF ID", Trainee::getEsfId),
                new Csv.Column<>("Comments", Trainee::getComments));
        return Csv.of(columns, trainees);
    }
}
