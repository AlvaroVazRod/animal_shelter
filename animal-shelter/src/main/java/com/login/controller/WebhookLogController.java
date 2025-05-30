package com.login.controller;

import com.login.dto.WebhookLogDto;
import com.login.service.WebhookLogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhook-logs")
@CrossOrigin(origins = "http://localhost:5173")
public class WebhookLogController {

    private final WebhookLogService webhookLogService;

    public WebhookLogController(WebhookLogService webhookLogService) {
        this.webhookLogService = webhookLogService;
    }

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
