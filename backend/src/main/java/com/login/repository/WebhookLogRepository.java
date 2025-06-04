package com.login.repository;

import com.login.model.WebhookLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WebhookLogRepository extends JpaRepository<WebhookLog, Long> {
    Page<WebhookLog> findByEventTypeContainingIgnoreCase(String eventType, Pageable pageable);
}
