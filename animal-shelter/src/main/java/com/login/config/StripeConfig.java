package com.login.config;

import com.stripe.Stripe;
import org.springframework.stereotype.Component;

@Component
public class StripeConfig {

    public StripeConfig(StripeProperties stripeProperties) {
        Stripe.apiKey = stripeProperties.getApiKey();
    }
}
