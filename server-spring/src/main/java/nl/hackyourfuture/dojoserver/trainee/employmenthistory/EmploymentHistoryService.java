package nl.hackyourfuture.dojoserver.trainee.employmenthistory;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.shared.exception.DojoBadRequestException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import nl.hackyourfuture.dojoserver.trainee.employmenthistory.dto.EmploymentHistoryRequest;
import nl.hackyourfuture.dojoserver.trainee.employmenthistory.dto.EmploymentHistoryResponse;
import nl.hackyourfuture.dojoserver.trainee.profile.TraineeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmploymentHistoryService {
    private final EmploymentHistoryRepository employmentHistoryRepository;
    private final TraineeRepository traineeRepository;

    @Transactional(readOnly = true)
    public List<EmploymentHistoryResponse> getEmploymentHistory(String traineeId) {
        requireTrainee(traineeId);
        return employmentHistoryRepository.findByTraineeIdOrderByStartDateDesc(traineeId).stream()
                .map(EmploymentHistoryResponse::from)
                .toList();
    }

    @Transactional
    public EmploymentHistoryResponse createEmploymentHistory(String traineeId, EmploymentHistoryRequest request) {
        requireTrainee(traineeId);
        validateDates(request);

        var newRecord = EmploymentHistory.builder()
                .id(RandomUtils.generateRandomId())
                .traineeId(traineeId)
                .type(request.type())
                .companyName(request.companyName())
                .role(request.role())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .feeCollected(request.feeCollected())
                .feeAmount(request.feeAmount())
                .comments(request.comments())
                .build();

        EmploymentHistory created = employmentHistoryRepository.save(newRecord);
        return EmploymentHistoryResponse.from(created);
    }

    @Transactional
    public EmploymentHistoryResponse updateEmploymentHistory(String traineeId, String id,
            EmploymentHistoryRequest request) {
        EmploymentHistory employmentHistory = findEmploymentHistory(traineeId, id);
        validateDates(request);

        employmentHistory.setType(request.type());
        employmentHistory.setCompanyName(request.companyName());
        employmentHistory.setRole(request.role());
        employmentHistory.setStartDate(request.startDate());
        employmentHistory.setEndDate(request.endDate());
        employmentHistory.setFeeCollected(request.feeCollected());
        employmentHistory.setFeeAmount(request.feeAmount());
        employmentHistory.setComments(request.comments());

        return EmploymentHistoryResponse.from(employmentHistory);
    }

    @Transactional
    public void deleteEmploymentHistory(String traineeId, String id) {
        employmentHistoryRepository.delete(findEmploymentHistory(traineeId, id));
    }

    /** Every endpoint here is nested under a trainee, so an unknown trainee id is a 404 of its own. */
    private void requireTrainee(String traineeId) {
        if (!traineeRepository.existsById(traineeId)) {
            throw new DojoNotFoundException("Trainee", traineeId);
        }
    }

    private EmploymentHistory findEmploymentHistory(String traineeId, String id) {
        requireTrainee(traineeId);
        return employmentHistoryRepository.findByIdAndTraineeId(id, traineeId)
                .orElseThrow(() -> new DojoNotFoundException("Employment history", id));
    }

    /** Bean validation cannot compare two fields, so the date order is checked here. */
    private void validateDates(EmploymentHistoryRequest request) {
        if (request.endDate() != null && request.endDate().isBefore(request.startDate())) {
            throw new DojoBadRequestException("The end date cannot be before the start date.");
        }
    }
}
