package com.login.service;

public interface EmailService {
    void sendSimpleMessage(String to, String subject, String text);
}