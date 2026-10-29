package nl.hackyourfuture.dojoserver.partner.organisation.dto;

import nl.hackyourfuture.dojoserver.admin.user.User;
import nl.hackyourfuture.dojoserver.partner.organisation.Organisation;
import nl.hackyourfuture.dojoserver.shared.Csv;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

/** The organisation export: every profile field, with the responsibles by name. */
public final class OrganisationCsv {
    private OrganisationCsv() {
    }

    public static String of(List<Organisation> organisations, Map<String, User> users) {
        List<Csv.Column<Organisation>> columns = List.of(
                new Csv.Column<>("Name", Organisation::getName),
                new Csv.Column<>("Website URL", Organisation::getWebsiteUrl),
                new Csv.Column<>("LinkedIn URL", Organisation::getLinkedinUrl),
                new Csv.Column<>("City",
                        organisation -> organisation.getCity() == null ? null : organisation.getCity().getName()),
                new Csv.Column<>("Province",
                        organisation -> organisation.getCity() == null ? null : organisation.getCity().getProvince()),
                new Csv.Column<>("Status", Organisation::getStatus),
                new Csv.Column<>("Partnership types", Organisation::getPartnershipTypes),
                new Csv.Column<>("Responsibles", organisation -> responsibles(organisation, users)),
                new Csv.Column<>("Notes", Organisation::getNotes));
        return Csv.of(columns, organisations);
    }

    // The names in the stored order, the primary first, skipping a user that no longer exists.
    private static String responsibles(Organisation organisation, Map<String, User> users) {
        return organisation.getResponsibleIds().stream()
                .map(users::get)
                .filter(Objects::nonNull)
                .map(User::getName)
                .collect(Collectors.joining("; "));
    }
}
