package com.login.dto;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Data
@Schema(description = "Data transfer object representing a received Stripe webhook event")
public class WebhookLogDto {

    @Schema(description = "Unique identifier of the webhook log entry", example = "501")
    private Long id;

    @Schema(description = "Type of the Stripe event received", example = "checkout.session.completed")
    private String eventType;

    @Schema(description = "Raw JSON payload of the webhook event", example = "{...}")
    private String rawPayload;

    @Schema(description = "Timestamp when the event was received", example = "2024-06-01T14:25:00")
    private LocalDateTime receivedAt;
}
