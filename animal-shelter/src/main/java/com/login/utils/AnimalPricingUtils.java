package com.login.utils;

import com.login.model.Animal;

public class AnimalPricingUtils {

    public static double calcularPrecioApadrinamiento(Animal animal) {
        double base = 10.0;

        // Ajustes por especie
        if (animal.getSpecies().equalsIgnoreCase("perro")) base += 5;
        else if (animal.getSpecies().equalsIgnoreCase("gato")) base += 3;

        // Ajustes por género
        if (Boolean.TRUE.equals(animal.getGender())) base += 2; // macho
        else base += 1; // hembra

        // Ajustes por tamaño
        base += (animal.getWeight() != null ? animal.getWeight() : 0) * 0.3;
        base += (animal.getHeight() != null ? animal.getHeight() : 0) * 0.2;
        base += (animal.getLength() != null ? animal.getLength() : 0) * 0.2;

        // Ajuste por edad
        if (animal.getAge() != null && animal.getAge() > 7) base += 4; // mayores
        else if (animal.getAge() != null && animal.getAge() > 2) base += 2;

        return Math.round(base * 100.0) / 100.0;
    }
}
