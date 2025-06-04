package com.login.service;

import com.stripe.exception.StripeException;

public interface StripeService {
    String createProduct(String name, String description) throws StripeException;
    String createRecurringPrice(String productId, Double amount) throws StripeException;
    void archiveProduct(String productId) throws StripeException;
    public void updateProduct(String productId, String newName, String newDescription) throws StripeException;
    ProductAndPrice ensureActiveProductAndPrice(
            String currentProductId,
            String currentPriceId,
            String name,
            String description,
            double priceValue
        ) throws StripeException;
	void archivePrice(String priceId) throws StripeException;

}
