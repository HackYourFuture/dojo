package nl.hackyourfuture.dojoserver.partner.contactperson;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.partner.contactperson.dto.ContactPersonRequest;
import nl.hackyourfuture.dojoserver.partner.contactperson.dto.ContactPersonResponse;
import nl.hackyourfuture.dojoserver.shared.DojoError;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/organisations/{organisationId}/contact-persons")
@RequiredArgsConstructor
@Tag(name = "Organisation Contact Persons", description = "Operations on the contact persons of an organisation")
public class ContactPersonController {

    private final ContactPersonService contactPersonService;

    @GetMapping
    @Operation(summary = "List the contact persons of an organisation",
            description = "Returns every contact person at the organisation, ordered by name.")
    @ApiResponse(responseCode = "200", description = "The contact persons of the organisation")
    @ApiResponse(
            responseCode = "404",
            description = "The organisation id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public List<ContactPersonResponse> getContactPersons(
            @Parameter(description = "ID of the organisation", example = "Xk2pQ9rTbW")
            @PathVariable
            String organisationId) {
        return contactPersonService.getContactPersons(organisationId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Add a contact person",
            description = "Adds a contact person to the organisation and returns it with its generated id.")
    @ApiResponse(responseCode = "201", description = "The contact person was created")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The organisation id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public ContactPersonResponse createContactPerson(
            @Parameter(description = "ID of the organisation", example = "Xk2pQ9rTbW")
            @PathVariable
            String organisationId,
            @Valid @RequestBody
            ContactPersonRequest request) {
        return contactPersonService.createContactPerson(organisationId, request);
    }

    @PutMapping("/{contactPersonId}")
    @Operation(summary = "Update an existing contact person",
            description = "Replaces the details of the contact person with the given id.")
    @ApiResponse(responseCode = "200", description = "The updated contact person")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The organisation id or the contact person id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public ContactPersonResponse updateContactPerson(
            @Parameter(description = "ID of the organisation", example = "Xk2pQ9rTbW")
            @PathVariable
            String organisationId,
            @Parameter(description = "ID of the contact person to update", example = "q7LmZ2cVnR")
            @PathVariable
            String contactPersonId,
            @Valid @RequestBody
            ContactPersonRequest request) {
        return contactPersonService.updateContactPerson(organisationId, contactPersonId, request);
    }

    @DeleteMapping("/{contactPersonId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an existing contact person",
            description = "Permanently deletes the contact person from the organisation.")
    @ApiResponse(responseCode = "204", description = "The contact person has been successfully deleted")
    @ApiResponse(
            responseCode = "404",
            description = "The organisation id or the contact person id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public void deleteContactPerson(
            @Parameter(description = "ID of the organisation", example = "Xk2pQ9rTbW")
            @PathVariable
            String organisationId,
            @Parameter(description = "ID of the contact person to delete", example = "q7LmZ2cVnR")
            @PathVariable
            String contactPersonId) {
        contactPersonService.deleteContactPerson(organisationId, contactPersonId);
    }
}
