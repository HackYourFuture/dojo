package nl.hackyourfuture.dojoserver.volunteer.assignment;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.shared.exception.DojoBadRequestException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import nl.hackyourfuture.dojoserver.volunteer.VolunteerRepository;
import nl.hackyourfuture.dojoserver.volunteer.assignment.dto.VolunteerAssignmentRequest;
import nl.hackyourfuture.dojoserver.volunteer.assignment.dto.VolunteerAssignmentResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VolunteerAssignmentService {
    private final VolunteerAssignmentRepository assignmentRepository;
    private final VolunteerRepository volunteerRepository;

    @Transactional(readOnly = true)
    public List<VolunteerAssignmentResponse> getAssignments(String volunteerId) {
        requireVolunteer(volunteerId);
        return assignmentRepository.findByVolunteerIdOrderByStartDateDesc(volunteerId).stream()
                .map(VolunteerAssignmentResponse::from)
                .toList();
    }

    @Transactional
    public VolunteerAssignmentResponse createAssignment(String volunteerId, VolunteerAssignmentRequest request) {
        requireVolunteer(volunteerId);
        validateDates(request);

        var newAssignment = VolunteerAssignment.builder()
                .id(RandomUtils.generateRandomId())
                .volunteerId(volunteerId)
                .type(request.type())
                .estimatedHours(request.estimatedHours())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .notes(request.notes())
                .build();

        return VolunteerAssignmentResponse.from(assignmentRepository.save(newAssignment));
    }

    @Transactional
    public VolunteerAssignmentResponse updateAssignment(String volunteerId, String id,
            VolunteerAssignmentRequest request) {
        VolunteerAssignment assignment = findAssignment(volunteerId, id);
        validateDates(request);

        assignment.setType(request.type());
        assignment.setEstimatedHours(request.estimatedHours());
        assignment.setStartDate(request.startDate());
        assignment.setEndDate(request.endDate());
        assignment.setNotes(request.notes());

        return VolunteerAssignmentResponse.from(assignment);
    }

    @Transactional
    public void deleteAssignment(String volunteerId, String id) {
        assignmentRepository.delete(findAssignment(volunteerId, id));
    }

    // Every endpoint here is nested under a volunteer, so an unknown volunteer id is a 404 of its own.
    private void requireVolunteer(String volunteerId) {
        if (!volunteerRepository.existsById(volunteerId)) {
            throw new DojoNotFoundException("Volunteer", volunteerId);
        }
    }

    private VolunteerAssignment findAssignment(String volunteerId, String id) {
        requireVolunteer(volunteerId);
        return assignmentRepository.findByIdAndVolunteerId(id, volunteerId)
                .orElseThrow(() -> new DojoNotFoundException("Volunteer assignment", id));
    }

    // Bean validation cannot compare two fields, so the date order is checked here.
    private void validateDates(VolunteerAssignmentRequest request) {
        if (request.endDate() != null && request.endDate().isBefore(request.startDate())) {
            throw new DojoBadRequestException("The end date cannot be before the start date.");
        }
    }
}
