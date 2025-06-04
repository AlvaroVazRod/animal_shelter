package com.login.service.impl;

import com.login.dto.WebhookLogDto;
import com.login.mapper.WebhookLogMapper;
import com.login.repository.WebhookLogRepository;
import com.login.service.WebhookLogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class WebhookLogServiceImpl implements WebhookLogService {

    private final WebhookLogRepository webhookLogRepository;

    public WebhookLogServiceImpl(WebhookLogRepository webhookLogRepository) {
        this.webhookLogRepository = webhookLogRepository;
    }

    @Override
    public Page<WebhookLogDto> getLogs(String eventType, Pageable pageable) {
        if (eventType != null && !eventType.isBlank()) {
            return webhookLogRepository
                .findByEventTypeContainingIgnoreCase(eventType, pageable)
                .map(WebhookLogMapper::toDto);
        } else {
            return webhookLogRepository.findAll(pageable).map(WebhookLogMapper::toDto);
        }
    }
}
