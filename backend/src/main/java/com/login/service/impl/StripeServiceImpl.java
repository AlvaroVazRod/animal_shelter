package com.login.service.impl;

import com.login.service.ProductAndPrice;
import com.login.service.StripeService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Price;
import com.stripe.model.Product;
import com.stripe.param.PriceCreateParams;
import com.stripe.param.ProductCreateParams;
import com.stripe.param.ProductUpdateParams;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeServiceImpl implements StripeService {

    public StripeServiceImpl(@Value("${stripe.apiKey}") String apiKey) {
        Stripe.apiKey = apiKey;
    }

    @Override
    public String createProduct(String name, String description) throws StripeException {
        ProductCreateParams params = ProductCreateParams.builder()
                .setName(name)
                .setDescription(description)
                .build();

        Product product = Product.create(params);
        return product.getId();
    }

    @Override
    public String createRecurringPrice(String productId, Double amount) throws StripeException {
        long amountInCents = (long) (amount * 100); 

        PriceCreateParams.Recurring recurring = PriceCreateParams.Recurring.builder()
                .setInterval(PriceCreateParams.Recurring.Interval.MONTH)
                .build();

        PriceCreateParams params = PriceCreateParams.builder()
                .setProduct(productId)
                .setCurrency("eur")
                .setUnitAmount(amountInCents)
                .setRecurring(recurring)
                .build();

        Price price = Price.create(params);
        return price.getId();
    }

    @Override
    public void archiveProduct(String productId) throws StripeException {
        Product product = Product.retrieve(productId);
        ProductUpdateParams params = ProductUpdateParams.builder()
                .setActive(false)
                .build();
        product.update(params);
    }
    @Override
    public void updateProduct(String productId, String newName, String newDescription) throws StripeException {
        Product product = Product.retrieve(productId);

        ProductUpdateParams.Builder paramsBuilder = ProductUpdateParams.builder();

        if (newName != null && !newName.isBlank()) {
            paramsBuilder.setName(newName);
        }

        if (newDescription != null && !newDescription.isBlank()) {
            paramsBuilder.setDescription(newDescription);
        }

        product.update(paramsBuilder.build());
    }
    
    @Override
    public void archivePrice(String priceId) throws StripeException {
        Price price = Price.retrieve(priceId);
        Price updated = price.update(Map.of("active", false));
        System.out.println("Price archived: " + updated.getId());
    }
    
    @Override
    public ProductAndPrice ensureActiveProductAndPrice(String currentProductId, String currentPriceId, String name, String description, double priceValue) throws StripeException {
        boolean createNew = false;

        if (currentProductId == null || currentProductId.isBlank()) {
            createNew = true;
        } else {
            Product product = Product.retrieve(currentProductId);
            if (!product.getActive()) {
                createNew = true;
            }
        }

        if (createNew) {
            String newProductId = createProduct(name, description);
            String newPriceId = createRecurringPrice(newProductId, priceValue);
            return new ProductAndPrice(newProductId, newPriceId);
        }

        return new ProductAndPrice(currentProductId, currentPriceId);
    }


}
