package nl.hackyourfuture.dojoserver.dashboard;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.dashboard.dto.DashboardResponse;
import nl.hackyourfuture.dojoserver.shared.DojoError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Trainee statistics")
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping
    @Operation(summary = "Get dashboard",
            description = "Returns the headline numbers and trainee counts by status, track, education level, country and gender, optionally for a range of current cohorts.")
    @ApiResponse(responseCode = "200", description = "The dashboard statistics")
    @ApiResponse(
            responseCode = "400",
            description = "A request parameter is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public DashboardResponse getDashboard(
            @Parameter(
                    description = "Only trainees whose current cohort is this one or later",
                    example = "40")
            @RequestParam(required = false)
            Integer startCohort,

            @Parameter(
                    description = "Only trainees whose current cohort is this one or earlier",
                    example = "55")
            @RequestParam(required = false)
            Integer endCohort
    ) {
        return dashboardService.getDashboard(startCohort, endCohort);
    }
}
