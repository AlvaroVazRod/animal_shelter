package com.login.service;

import com.login.dto.WebhookLogDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WebhookLogService {
    Page<WebhookLogDto> getLogs(String eventType, Pageable pageable);
}
