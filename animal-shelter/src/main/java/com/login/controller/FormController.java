package com.login.controller;

import com.login.dto.AdoptionFormDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forms")
@CrossOrigin
public class FormController {

    private final JavaMailSender mailSender;

    @Value("${mail.destination}")
    private String destinationEmail;

    public FormController(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    
    @PostMapping("/send")
    public ResponseEntity<String> sendForm(@Valid @RequestBody AdoptionFormDto form) {
        if (!form.isAgreeToTerms()) {
            return ResponseEntity.badRequest().body("Debes aceptar los términos y condiciones para enviar el formulario.");
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(destinationEmail);
            message.setSubject("Nueva solicitud de adopción");
            message.setText(
                "Nombre: " + form.getName() + "\n" +
                "Email: " + form.getEmail() + "\n" +
                "Teléfono: " + form.getPhone() + "\n" +
                "Dirección: " + form.getAddress() + "\n" +
                "Empleo: " + form.getEmployment() + "\n" +
                "¿Tiene otras mascotas?: " + (form.isHasOtherPets() ? "Sí" : "No") + "\n" +
                "Acepta términos: " + (form.isAgreeToTerms() ? "Sí" : "No")
            );
            mailSender.send(message);
            return ResponseEntity.ok("Formulario enviado correctamente");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al enviar el formulario: " + e.getMessage());
        }
    }


}
