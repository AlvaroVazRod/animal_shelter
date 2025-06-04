package com.login.mapper;

import com.login.dto.WebhookLogDto;
import com.login.model.WebhookLog;

public class WebhookLogMapper {
    public static WebhookLogDto toDto(WebhookLog log) {
        WebhookLogDto dto = new WebhookLogDto();
        dto.setId(log.getId());
        dto.setEventType(log.getEventType());
        dto.setRawPayload(log.getRawPayload());
        dto.setReceivedAt(log.getReceivedAt());
        return dto;
    }
}
