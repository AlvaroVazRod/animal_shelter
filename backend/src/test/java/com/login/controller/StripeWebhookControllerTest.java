package com.login.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.login.model.Donation;
import com.login.repository.AnimalRepository;
import com.login.repository.DonationRepository;
import com.login.repository.SponsorRepository;
import com.login.repository.UserRepository;
import com.login.repository.WebhookLogRepository;
import com.login.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class StripeWebhookControllerTest {

    private static final String PAYMENT_INTENT_ID = "pi_123";

    private final ObjectMapper objectMapper = new ObjectMapper();
    private DonationRepository donationRepository;
    private StripeWebhookController controller;

    @BeforeEach
    void setUp() {
        donationRepository = mock(DonationRepository.class);
        controller = new StripeWebhookController(
                donationRepository,
                mock(UserRepository.class),
                mock(AnimalRepository.class),
                mock(WebhookLogRepository.class),
                mock(SponsorRepository.class),
                mock(EmailService.class));
    }

    @Test
    void firstEventCreatesTheDonation() throws Exception {
        when(donationRepository.findByStripePaymentIntentId(PAYMENT_INTENT_ID)).thenReturn(Optional.empty());

        controller.handleDonation("payment_intent.succeeded", paymentIntent(PAYMENT_INTENT_ID, 2500));

        Donation saved = savedDonation();
        assertEquals(Donation.Status.completed, saved.getStatus());
        assertEquals(25.0, saved.getQuantity());
        assertEquals(PAYMENT_INTENT_ID, saved.getStripePaymentIntentId());
    }

    @Test
    void successAfterFailureUpdatesTheExistingDonation() throws Exception {
        Donation existing = donation(Donation.Status.failed);
        when(donationRepository.findByStripePaymentIntentId(PAYMENT_INTENT_ID)).thenReturn(Optional.of(existing));

        controller.handleDonation("payment_intent.succeeded", paymentIntent(PAYMENT_INTENT_ID, 2500));

        assertEquals(Donation.Status.completed, savedDonation().getStatus());
    }

    @Test
    void sameEventDeliveredTwiceDoesNotSaveAgain() throws Exception {
        Donation existing = donation(Donation.Status.completed);
        when(donationRepository.findByStripePaymentIntentId(PAYMENT_INTENT_ID)).thenReturn(Optional.of(existing));

        controller.handleDonation("payment_intent.succeeded", paymentIntent(PAYMENT_INTENT_ID, 2500));

        verify(donationRepository, never()).save(any());
    }

    @Test
    void lateFailureDoesNotDowngradeACompletedDonation() throws Exception {
        Donation existing = donation(Donation.Status.completed);
        when(donationRepository.findByStripePaymentIntentId(PAYMENT_INTENT_ID)).thenReturn(Optional.of(existing));

        controller.handleDonation("payment_intent.payment_failed", paymentIntent(PAYMENT_INTENT_ID, 2500));

        verify(donationRepository, never()).save(any());
        assertEquals(Donation.Status.completed, existing.getStatus());
    }

    @Test
    void refundUpdatesTheDonationFoundThroughThePaymentIntentOfTheCharge() throws Exception {
        Donation existing = donation(Donation.Status.completed);
        when(donationRepository.findByStripePaymentIntentId(PAYMENT_INTENT_ID)).thenReturn(Optional.of(existing));

        controller.handleDonation("charge.refunded", charge("ch_456", PAYMENT_INTENT_ID, 2500));

        Donation saved = savedDonation();
        assertSame(existing, saved);
        assertEquals(Donation.Status.refunded, saved.getStatus());
    }

    @Test
    void chargeWithoutPaymentIntentIsIgnored() throws Exception {
        controller.handleDonation("charge.refunded", charge("ch_456", null, 2500));

        verify(donationRepository, never()).save(any());
    }

    private Donation savedDonation() {
        ArgumentCaptor<Donation> captor = ArgumentCaptor.forClass(Donation.class);
        verify(donationRepository).save(captor.capture());
        return captor.getValue();
    }

    private Donation donation(Donation.Status status) {
        Donation donation = new Donation();
        donation.setStripePaymentIntentId(PAYMENT_INTENT_ID);
        donation.setStatus(status);
        donation.setQuantity(25.0);
        return donation;
    }

    private JsonNode paymentIntent(String id, int amountInCents) throws Exception {
        return objectMapper.readTree("{\"id\":\"" + id + "\",\"amount\":" + amountInCents + "}");
    }

    private JsonNode charge(String chargeId, String paymentIntentId, int amountInCents) throws Exception {
        String paymentIntent = paymentIntentId == null ? "null" : "\"" + paymentIntentId + "\"";
        return objectMapper.readTree("{\"id\":\"" + chargeId + "\",\"payment_intent\":" + paymentIntent
                + ",\"amount\":" + amountInCents + "}");
    }
}
