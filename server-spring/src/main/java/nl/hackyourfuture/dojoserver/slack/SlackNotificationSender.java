package nl.hackyourfuture.dojoserver.slack;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.config.DojoProperties;
import nl.hackyourfuture.dojoserver.interaction.Interaction;
import nl.hackyourfuture.dojoserver.trainee.assessment.Assessment;
import nl.hackyourfuture.dojoserver.trainee.employmenthistory.EmploymentHistory;
import nl.hackyourfuture.dojoserver.trainee.profile.Trainee;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class SlackNotificationSender {
    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("d MMM uuuu", Locale.ENGLISH);

    private final SlackClient slackClient;
    private final DojoProperties dojoProperties;

    public void traineeCreated(String reporter, Trainee trainee) {
        var message = """
                ### :sparkles: New trainee
                Trainee: %s
                By: %s

                | Status | Cohort |
                | --- | --- |
                | %s | %s |
                ---""".formatted(
                traineeLink(trainee),
                reporter,
                value(trainee.getLearningStatus()),
                value(trainee.getCurrentCohort()));
        slackClient.sendNotification(message);
    }

    public void traineeUpdated(String reporter, Trainee trainee, List<FieldChange> changes) {
        if (changes.isEmpty()) {
            return;
        }

        var rows = new StringBuilder();
        changes.forEach(change -> rows.append("| %s | %s | %s |\n".formatted(
                humanize(change.field()),
                value(change.from()),
                value(change.to())
        ))
        );

        var message = """
                ### :pencil2: Trainee updated
                Trainee: %s
                By: %s

                | Field | From | To |
                | --- | --- | --- |
                %s---""".formatted(traineeLink(trainee), reporter, rows);
        slackClient.sendNotification(message);
    }

    public void traineeDeleted(String reporter, Trainee trainee) {
        // No link: the profile it would point at is gone.
        var message = """
                ### :wastebasket: Trainee deleted
                Trainee: %s
                By: %s
                ---""".formatted(trainee.getDisplayName(), reporter);
        slackClient.sendNotification(message);
    }

    public void traineeInteractionCreated(String reporter, Trainee trainee, Interaction interaction) {
        var message = """
                ### :speech_balloon: Interaction logged
                Trainee: %s
                By: %s

                | Type | Title |
                | --- | --- |
                | %s | %s |
                ---""".formatted(traineeLink(trainee), reporter,
                value(interaction.getType()), cell(interaction.getTitle()));
        slackClient.sendNotification(message);
    }

    public void traineeEmploymentHistoryCreated(String reporter, Trainee trainee, EmploymentHistory employment) {
        var message = """
                ### :briefcase: Employment added
                Trainee: %s
                By: %s

                | Company | Role |
                | --- | --- |
                | %s | %s |
                ---""".formatted(traineeLink(trainee), reporter,
                cell(employment.getCompanyName()), cell(employment.getRole()));
        slackClient.sendNotification(message);
    }

    public void traineeAssessmentCreated(String reporter, Trainee trainee, Assessment assessment) {
        var message = """
                ### :clipboard: Assessment added
                Trainee: %s
                By: %s

                | Assessment | Result | Score |
                | --- | --- | --- |
                | %s | %s | %s |
                ---""".formatted(
                traineeLink(trainee),
                reporter,
                value(assessment.getType()),
                value(assessment.getResult()),
                value(assessment.getScore()));
        slackClient.sendNotification(message);
    }

    private String traineeLink(Trainee trainee) {
        var absoluteUrl = UriComponentsBuilder.fromUriString(dojoProperties.baseUrl())
                .path(trainee.getProfilePath())
                .build()
                .toUriString();
        return String.format("[%s](%s)", cell(trainee.getDisplayName()), absoluteUrl);
    }

    private static String value(Object object) {
        return switch (object) {
            case null -> "—";
            case Enum<?> constant -> humanize(constant);
            case Boolean flag -> flag ? "Yes" : "No";
            case LocalDate date -> DATE.format(date);
            default -> cell(String.valueOf(object));
        };
    }

    private static String cell(String value) {
        if (value == null || value.isBlank()) {
            return "—";
        }
        return value
                .replace("|", "\\|")
                .replaceAll("\\s+", " ")
                .strip();
    }

    /** `TECH_HOUR` and `learningStatus` both read as "Tech hour" / "Learning status". */
    private static String humanize(Enum<?> value) {
        return humanize(value.name().toLowerCase(Locale.ROOT).replace('_', ' '));
    }

    private static String humanize(String name) {
        String words = name.replaceAll("([a-z0-9])([A-Z])", "$1 $2").toLowerCase(Locale.ROOT).strip();
        return words.isEmpty() ? words : Character.toUpperCase(words.charAt(0)) + words.substring(1);
    }
}
