package com.login.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WebhookLogDto {
    private Long id;
    private String eventType;
    private String rawPayload;
    private LocalDateTime receivedAt;
}
