package com.login.service;

public class ProductAndPrice {
    private final String productId;
    private final String priceId;

    public ProductAndPrice(String productId, String priceId) {
        this.productId = productId;
        this.priceId = priceId;
    }

    public String getProductId() {
        return productId;
    }

    public String getPriceId() {
        return priceId;
    }
}
