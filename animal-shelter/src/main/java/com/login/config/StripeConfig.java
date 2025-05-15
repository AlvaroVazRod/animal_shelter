package com.login.config;

import com.stripe.Stripe;
import org.springframework.stereotype.Component;

@Component
public class StripeConfig {

	public StripeConfig(StripeProperties stripeProperties) {
		System.out.println("✅ StripeConfig cargado. Clave Stripe: " + stripeProperties.getApiKey());
		Stripe.apiKey = stripeProperties.getApiKey();
	}
}
