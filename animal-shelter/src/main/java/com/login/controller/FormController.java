package com.login.controller;

import com.login.dto.AdoptionFormDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Adoption Forms", description = "Operations for sending adoption request forms")
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

    @Operation(summary = "Send adoption form", description = "Sends an adoption request form via email to the configured destination")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Form sent successfully"),
        @ApiResponse(responseCode = "400", description = "User did not agree to terms"),
        @ApiResponse(responseCode = "500", description = "Error sending email")
    })
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
