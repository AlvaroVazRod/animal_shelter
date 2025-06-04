package com.login.controller;

import com.login.dto.WebhookLogDto;
import com.login.service.WebhookLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Webhook Logs", description = "Endpoints to retrieve Stripe webhook logs with pagination and filtering")
@RestController
@RequestMapping("/api/webhook-logs")
@CrossOrigin(origins = "http://localhost:5173")
public class WebhookLogController {

    private final WebhookLogService webhookLogService;

    public WebhookLogController(WebhookLogService webhookLogService) {
        this.webhookLogService = webhookLogService;
    }

    @Operation(
        summary = "Get webhook logs",
        description = "Retrieves paginated logs of received Stripe webhook events, filtered by event type"
    )
    @ApiResponse(responseCode = "200", description = "Webhook logs retrieved successfully")
    @GetMapping
    public Page<WebhookLogDto> getLogs(
            @RequestParam(defaultValue = "") String eventType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "receivedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        PageRequest pageable = PageRequest.of(page, size, sort);
        return webhookLogService.getLogs(eventType, pageable);
    }
}
