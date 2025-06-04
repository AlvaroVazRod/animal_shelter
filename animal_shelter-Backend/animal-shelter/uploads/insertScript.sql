
-- Insertar usuarios
INSERT INTO users (username, email, password, name, surname, phone, role, image) VALUES
('jdoe', 'jdoe@example.com', SHA2('password123', 256), 'John', 'Doe', '+123456789', 'USER', NULL),
('admin', 'admin@example.com', SHA2('adminpass', 256), 'Admin', 'Root', NULL, 'ADMIN', NULL),
('admin2', 'admin2@gmail.com', '$2a$10$1TSHHZqGhoQY80HlCZWPN.a5V9ZTYShicj3VuRa.Cs2A/I7gS4TQm', 'admin2', 'admin2', NULL, 'ADMIN', NULL);

-- Insertar animales
INSERT INTO animals (name, description, weight, height, length, age, gender, color, image, species, breed, adoption_price, sponsor_price, collected, status) VALUES
('Luna', 'Friendly female dog rescued from the street.', 15.20, 45.00, 80.00, 3, FALSE, 'Brown', 'luna.jpg', 'Dog', 'Mixed', 120.00, null, 100.00, 'active'),
('Milo', 'Playful kitten who loves attention.', 2.50, 20.00, 30.00, 1, TRUE, 'Black', 'milo.jpg', 'Cat', 'Siamese', 90.00, null, 50.00, 'active'),
('Bella', 'Needs urgent surgery for her leg.', 12.00, 40.00, 75.00, 4, FALSE, 'White', 'bella.jpg', 'Dog', 'Terrier', 150.00, null, 30.00, 'requires_funding'),
('Rocky', 'Large dog with a calm personality.', 25.00, 60.00, 100.00, 6, TRUE, 'Black and Brown', 'rocky.jpg', 'Dog', 'Rottweiler', 130.00, null, 0.00, 'draft'),
('Nina', 'Shy but affectionate cat.', 3.00, 22.00, 35.00, 2, FALSE, 'Grey', 'nina.jpg', 'Cat', 'Persian', 100.00, null, 0.00, 'active');

-- Insertar imágenes de animales
INSERT INTO animals_image (filename, animal_id) VALUES
('luna.jpg', 1),
('bella.jpg', 3),
('nina.jpg',5),
('nina2.jpg',5),
('milo.jpg', 2);

-- Insertar etiquetas
INSERT INTO tags (name, description, color, icon) VALUES
('Vaccinated', 'This animal is fully vaccinated.', '#00FF00', 'vaccine.png'),
('Neutered', 'This animal is neutered/spayed.', '#FFA500', 'neutered.png'),
('Special Needs', 'This animal requires special care.', '#FF0000', 'care.png');

-- Relación animal-tag
INSERT INTO animals_tags (id_animal, id_tag) VALUES
(1, 1),
(1, 2),
(2, 1);

-- Apadrinamientos
INSERT INTO sponsors (quantity, status, stripe_ref, id_user, id_animal) VALUES
(15.00, 'completed', 'spon_001', 1, 1),
(10.00, 'completed', 'spon_002', 1, 2);

-- Formularios
INSERT INTO forms (formdata) VALUES
('{"employment": "yes", "has_other_pets": "no", "home_type": "apartment"}');

-- Adopciones
INSERT INTO adoptions (quantity, status, data, stripe_ref, id_user, id_animal, id_form) VALUES
(120.00, 'completed', '2024-10-01', 'adopt_001', 1, 1, 1);

-- Transferencias
INSERT INTO webhook_log (event_type, raw_payload, received_at) VALUES
('checkout.session.completed', '{"id":"evt_001","object":"event","data":{"object":{"id":"sess_001"}}}', '2024-12-01 10:15:00'),
('payment_intent.succeeded', '{"id":"evt_002","object":"event","data":{"object":{"id":"pi_001"}}}', '2025-01-15 14:22:30'),
('payment_intent.failed', '{"id":"evt_003","object":"event","data":{"object":{"id":"pi_002"}}}', '2025-02-05 18:45:00'),
('charge.refunded', '{"id":"evt_004","object":"event","data":{"object":{"id":"ch_001"}}}', '2025-02-10 12:05:45'),
('checkout.session.completed', '{"id":"evt_005","object":"event","data":{"object":{"id":"sess_002"}}}', '2025-03-01 08:00:00'),
('invoice.payment_succeeded', '{"id":"evt_006","object":"event","data":{"object":{"id":"in_001"}}}', '2025-03-10 09:30:00'),
('invoice.payment_failed', '{"id":"evt_007","object":"event","data":{"object":{"id":"in_002"}}}', '2025-03-15 13:15:00'),
('customer.subscription.deleted', '{"id":"evt_008","object":"event","data":{"object":{"id":"sub_001"}}}', '2025-03-20 16:40:00'),
('customer.subscription.updated', '{"id":"evt_009","object":"event","data":{"object":{"id":"sub_002"}}}', '2025-04-01 11:10:10');

INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user1', 'user1@example.com', '$2b$12$K7soNJw1LmAdZloNvOMf4urPGZK6bfjll625SGKwdP9ODVRlAvWG.', 'Teodoro', 'Cobo', '+34816888602', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user2', 'user2@example.com', '$2b$12$k3bnoYjKFiVTKWd0ixqvBO.4uR9DvQn.uvR4crh7.ssBpfTNmXl7u', 'Bartolomé', 'León', '+34 802368162', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user3', 'user3@example.com', '$2b$12$kXncmjGr8eV.R6GqpMb.d.kdg1OKG.rcG19jTznVsPgfDdr80uWGe', 'Ester', 'Pina', '+34704049802', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user4', 'user4@example.com', '$2b$12$2f8iblHpZbNCD1f.MIYrQuOAoVtT5hVCYsigy9cBsnAoqmPWaKi66', 'Sandalio', 'Azorin', '+34731 27 98 08', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user5', 'user5@example.com', '$2b$12$tVvxI4wBEL48xNA3/QlEyuubNCaReLByNcegzI4qK2EDNJVsQEzxa', 'Ezequiel', 'Gimenez', '+34 647 67 49 31', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user6', 'user6@example.com', '$2b$12$ZY7Ip1hVi2kKxBacPa2dm.VsFpQL1cLV97kSIJe8u2hpD5LcWOVyS', 'Trinidad', 'Barceló', '+34 747281967', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user7', 'user7@example.com', '$2b$12$s/0UUMAqOc2/qOqQkpWdoOndbt9wLZL52xRz7pDwXK3uhB2Yt4ARC', 'Maximino', 'Quintana', '+34 728 55 97 24', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user8', 'user8@example.com', '$2b$12$YW47dJ4MXgLE6ft7Ue2Lbu.tQVUncfbg2hZSTUshA8xvqzL6SBTD.', 'Petrona', 'Macias', '+34 828918937', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user9', 'user9@example.com', '$2b$12$D1dp6jz/nDQ99kWCgvquYuePXhoa1MoKPyADj4QEQMHHTrw5PLbBG', 'Alonso', 'Menendez', '+34737083321', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user10', 'user10@example.com', '$2b$12$I9ziwIMw3LI.c9xNzZqdQO.VSoQz3LJG1TwPzZOyMwFMf0n6BQpLq', 'Javier', 'Llano', '+34863455479', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user11', 'user11@example.com', '$2b$12$hfXC6fqVEJhJFHJ.IxXj0eVnDwJbvQnU2AVvNu7Xc6dgmylz7G1pm', 'Yéssica', 'Hoz', '+34 804807587', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user12', 'user12@example.com', '$2b$12$heYm7GGZ./y/Et8JbGe2ceNWEfBY6a437PYljKT/fzxUSbA2KVfkK', 'Emilia', 'Reig', '+34 701 04 95 17', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user13', 'user13@example.com', '$2b$12$8.cJUfkM0NZrbaxhYWghWeV/ChJ6kL9OCVnEF.DmuEFC2QQEPOV5G', 'Emma', 'Manzanares', '+34714 66 06 54', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user14', 'user14@example.com', '$2b$12$Hl5QbO07nEYy41L1mdIwB.dFdWagDmqKbGVUV1VXiRHxjvBwMmlL.', 'Heliodoro', 'Seco', '+34711 42 39 38', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user15', 'user15@example.com', '$2b$12$x4H36zi6pwJxH/gYKp.XOOqQYhaVvl3Nh0t49MxybfrdnlHtAzmJC', 'Liliana', 'Casanovas', '+34632916256', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user16', 'user16@example.com', '$2b$12$ycoFD6OQc6sSrDIFNRFez.tbiDrebzcINAAQuIj.hqudPA6gPVBlK', 'Lorenza', 'Giner', '+34 735 32 10 37', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user17', 'user17@example.com', '$2b$12$xhecHy60zUf13wKVURnLaexvFGAM.TKWSe.RIFpRQkF8Lwzv5QhPK', 'Pía', 'Bermudez', '+34864 975 264', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user18', 'user18@example.com', '$2b$12$6RP9x3VQJjFmDJbq884u6.wPG/OwkgzdHMDRR/I2NUsNeEzOKdf4m', 'Felix', 'Infante', '+34 727 858 423', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user19', 'user19@example.com', '$2b$12$gEeYFUxDL32CKzCv4q8rPu2/JShI5vXY0i5bEXlItnUOp5oungQ7C', 'Anita', 'Alcalá', '+34 968507720', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user20', 'user20@example.com', '$2b$12$.66R5ol3hAWcHoTqcyDJleEJt3TPNccCd70RUj1IkM9QXydPA9L2.', 'Lázaro', 'Varela', '+34 714 160 210', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user21', 'user21@example.com', '$2b$12$g.PKqlPbtCGTEyktnqAQQ.zmUevImjB5Vv4791HCGsRgMWRSSNjJK', 'Leocadia', 'Valencia', '+34704840368', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user22', 'user22@example.com', '$2b$12$eHVwXv27uMGc/.yo5F85fukYYSIScMoBP.X9y3dd7QDfn8Xv.UsKW', 'Adelaida', 'Milla', '+34712 760 612', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user23', 'user23@example.com', '$2b$12$K3WoKGGNAmEYuJuvwFh9T.yv8qFDkZxx0NpBoe3q9ZUJINhKrhli2', 'Abril', 'Castro', '+34725 473 898', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user24', 'user24@example.com', '$2b$12$roMx4b3KPdz6tWt0fDbGU.Yt3xJGqnNXGpVjTf9ijpoAF0EwHStfa', 'Bienvenida', 'Villar', '+34 728724448', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user25', 'user25@example.com', '$2b$12$Ni0l.zWrqIKaw07frXseV.zeCyvZ1FgMLSDJRafC3dIoacFRwRdaK', 'Teodora', 'Guardia', '+34731 22 04 42', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user26', 'user26@example.com', '$2b$12$F1Vjsez7ndClgokfu5yBdOxFZDtzNLq/7gbsoAvDJqF39X.ekwh36', 'Apolinar', 'Peñalver', '+34740 99 58 30', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user27', 'user27@example.com', '$2b$12$JAMWexvv.h/wOZMKGHO1vuM.jBYzq91Qqu/GTjcp4XXYznU..UohC', 'Telmo', 'Ferrero', '+34 826 09 39 38', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user28', 'user28@example.com', '$2b$12$avpBh8JCE.0Y8N1MaUNrzeGMnJtGEn4Y0uKe9sU1mecR5OVEZlTYi', 'Clotilde', 'Andrade', '+34 733 43 89 29', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user29', 'user29@example.com', '$2b$12$5/NyyMy9wbZnp811srYyq.YqLlrgZ3pDrPQIB1CuSRUoasmPYBMTK', 'Lourdes', 'Mate', '+34 686 18 79 27', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user30', 'user30@example.com', '$2b$12$FIXmRr0UfTbplT0kl3Iqle1Tr0cRnXHZ2RfyDccAMx4DSdmCQjOVS', 'Telmo', 'Ayala', '+34961176200', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user31', 'user31@example.com', '$2b$12$tOFWsV5pESfhQ7FWXH/eMuU4s/4G/FvTUx31oMK22sfCCljWQV9by', 'Mar', 'Reig', '+34 711 460 406', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user32', 'user32@example.com', '$2b$12$ARvVxzKAgaz.mpSR1DU7.uHuP8wMB82PZxJ/JHYlQPXGtIHqXRaJ2', 'Viviana', 'Uriarte', '+34725 302 128', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user33', 'user33@example.com', '$2b$12$Pj1ySgT3DyfCRrPrIfiv8eCp9gybIUPAUexVjOk2DRNS8siatMEU.', 'Renata', 'Francisco', '+34 999883178', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user34', 'user34@example.com', '$2b$12$D7Pthj8Wt2CFxzFicS0NfeQCwLy0UIYlvACCWdmMQkqLJjZVw0FbG', 'Mariano', 'Alemany', '+34731 26 52 68', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user35', 'user35@example.com', '$2b$12$1K/cKISyQN2D7kqI3Lw.XOm.53hKtB7NIr6B7.Jv.9o2h1lGBGKDG', 'Azeneth', 'Izquierdo', '+34 730939546', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user36', 'user36@example.com', '$2b$12$XIe5eONR7zeJM/tcwqe1Nuqos9EthdC5xTaf.9n2EFJ9fe7YSCQyW', 'Porfirio', 'Rincón', '+34729 016 048', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user37', 'user37@example.com', '$2b$12$JCdIszesXA36DF8VADpsMee5nEJM7NalCTMe4VSPSoHFNTxinxlOC', 'Sandra', 'Samper', '+34 933 72 79 77', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user38', 'user38@example.com', '$2b$12$0BfoEPmP8KIlFn5lRbDfMOdQUbYqhCqwOVvegk2yXQ7t3TXV.ZTUG', 'Mar', 'Fuster', '+34715 755 126', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user39', 'user39@example.com', '$2b$12$.p1YyLb..aue0MpAzvwlfeC.oyArhN10aLfgNU.hsR8aNIuIR61ye', 'Candelas', 'Marin', '+34 743 452 276', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user40', 'user40@example.com', '$2b$12$6mCfjmvjIdx1VwrJ86tUeeZhFP/3vlhIZNXJ5IaF9s/5HdpSk.nmO', 'Telmo', 'Amo', '+34 711 419 818', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user41', 'user41@example.com', '$2b$12$3TNfN/4KescXYkgXktO0.O649NNgdcorzx3Muw3lcJhK0HzAcfpQG', 'Nazaret', 'Raya', '+34 701 85 33 18', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user42', 'user42@example.com', '$2b$12$APQyC.znCrdAivLr1bdku.qZMTNESF0v1NDwBjT4QEXDmLe2mWvqu', 'Olimpia', 'Alfaro', '+34 917 69 92 91', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user43', 'user43@example.com', '$2b$12$ld.gKzfocjdAHae7okRkteOmXz8V3GOAW/Ml0/djFU97s06L4Uyme', 'Nicolasa', 'Tomas', '+34 732309980', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user44', 'user44@example.com', '$2b$12$NFR3dbSLYoApMsE96Ov8oOKcm5ll0H4P.HcS5xKfI5A55Pvv7IMG2', 'Cristian', 'Galiano', '+34819 38 22 50', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user45', 'user45@example.com', '$2b$12$raURXSOeBB9yyWAs.StwpeTPE7tAgMQbnyam1/qybgld85/8cADFK', 'Patricio', 'Comas', '+34 748 844 522', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user46', 'user46@example.com', '$2b$12$5vUsBzznwlgLw75HuFudWuBbGy02GAcFB1XGtOdrxRnGmM1CdkpjW', 'Saturnino', 'Cruz', '+34 725360566', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user47', 'user47@example.com', '$2b$12$cagM/QyQ8iuD9Pz8xL.nvOaBZhsTZJS3lNk75tewfCrVIGRNCE1hq', 'Belén', 'Guerrero', '+34630 593 598', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user48', 'user48@example.com', '$2b$12$YdmxGRcATFZotVC4xcIeFuL8UdBQ1k1UHq0zvXxjaSsyXkMuW64Xm', 'Amancio', 'Blanch', '+34710 63 02 36', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user49', 'user49@example.com', '$2b$12$1/cI2Tnxrzx2/DMN03jhu.kKoeZGgdz4.uwocbjdWRRB8XTK3OxxG', 'Jacobo', 'Maestre', '+34 714653605', 'USER');
INSERT INTO users (username, email, password, name, surname, phone, role) VALUES ('user50', 'user50@example.com', '$2b$12$vXFz0Cb1SxLt73O5x/Rn8uDcNMhdYkzMD4CSZ93EXKB5TMSPgf92W', 'Manuela', 'Moya', '+34671995150', 'USER');
INSERT INTO animals (name, description, weight, height, length, age, gender, color, image, species, breed, adoption_price, sponsor_price, collected, status) VALUES ('Saturnina', 'Nihil aliquid optio animi eveniet doloribus quasi repudiandae voluptas.', 21.28, 47.06, 83.48, 1, 1, 'Marrón cuero', 'saturnina1.jpg', 'Dog', 'Beagle', 93.48, NULL, 50.66, 'active');
INSERT INTO animals (name, description, weight, height, length, age, gender, color, image, species, breed, adoption_price, sponsor_price, collected, status) VALUES ('Soraya', 'Doloribus veritatis esse ab consequatur consequuntur amet earum consequatur.', 14.56, 56.92, 32.47, 2, 0, 'Blanco nieve', 'soraya1.jpg', 'Dog', 'Labrador', 94.68, NULL, 36.84, 'draft');
INSERT INTO animals (name, description, weight, height, length, age, gender, color, image, species, breed, adoption_price, sponsor_price, collected, status) VALUES ('Chucho', 'Velit mollitia quisquam dignissimos in eos quasi asperiores quidem illo.', 8.64, 20.78, 45.86, 15, 0, 'Azul pizarra medio', 'chucho1.jpg', 'Cat', 'Maine Coon', 116.73, NULL, 72.48, 'active');
INSERT INTO animals (name, description, weight, height, length, age, gender, color, image, species, breed, adoption_price, sponsor_price, collected, status) VALUES ('Amaya', 'Molestias temporibus quis aliquid esse ratione deserunt asperiores velit.', 25.82, 67.17, 52.64, 1, 1, 'Verde prado', 'amaya1.jpg', 'Cat', 'Siamese', 145.88, NULL, 3.38, 'adopted');
INSERT INTO animals (name, description, weight, height, length, age, gender, color, image, species, breed, adoption_price, sponsor_price, collected, status) VALUES ('Azeneth', 'Architecto maiores mollitia inventore numquam quaerat.', 3.02, 27.56, 76.77, 11, 1, 'Gris oscuro', 'azeneth1.jpg', 'Cat', 'Persian', 98.49, NULL, 87.26, 'active');
INSERT INTO animals (name, description, weight, height, length, age, gender, color, image, species, breed, adoption_price, sponsor_price, collected, status) VALUES ('Bruno', 'Libero et qui dolorum suscipit dolor libero quas ut cupiditate esse necessitatibus.', 28.64, 38.81, 61.78, 5, 0, 'Azul cielo profundo', 'bruno1.jpg', 'Cat', 'Maine Coon', 127.56, NULL, 27.16, 'active');
INSERT INTO animals (name, description, weight, height, length, age, gender, color, image, species, breed, adoption_price, sponsor_price, collected, status) VALUES ('Adelia', 'Laboriosam eos optio possimus rerum culpa eligendi dolore velit.', 22.08, 55.79, 88.92, 15, 0, 'Rojo carmesí', 'adelia1.jpg', 'Dog', 'Poodle', 141.79, NULL, 39.14, 'draft');
INSERT INTO animals (name, description, weight, height, length, age, gender, color, image, species, breed, adoption_price, sponsor_price, collected, status) VALUES ('Aurelia', 'Nemo eius doloribus nulla voluptatibus corporis molestiae assumenda quidem saepe pariatur.', 13.69, 26.62, 63.22, 12, 0, 'Marrón perú', 'aurelia1.jpg', 'Cat', 'Siamese', 104.93, NULL, 57.54, 'draft');
INSERT INTO animals (name, description, weight, height, length, age, gender, color, image, species, breed, adoption_price, sponsor_price, collected, status) VALUES ('Victoriano', 'Rerum nobis voluptas iure voluptatem minus incidunt placeat eos itaque.', 19.45, 61.94, 91.72, 5, 0, 'Plata', 'victoriano1.jpg', 'Dog', 'Poodle', 88.55, NULL, 63.17, 'active');
INSERT INTO animals (name, description, weight, height, length, age, gender, color, image, species, breed, adoption_price, sponsor_price, collected, status) VALUES ('Teófila', 'Illum numquam earum et nostrum consequuntur sunt nisi officia ab iusto ducimus.', 4.07, 32.0, 64.26, 6, 1, 'Beige limón', 'teófila1.jpg', 'Dog', 'Beagle', 139.33, NULL, 8.68, 'active');
INSERT INTO animals (name, description, weight, height, length, age, gender, color, image, species, breed, adoption_price, sponsor_price, collected, status) VALUES ('Raúl', 'Dolor unde facere neque fuga commodi expedita quos ut hic vitae reiciendis magni minima.', 5.09, 24.41, 57.54, 11, 1, 'Beige antiguo', 'raúl1.jpg', 'Dog', 'Terrier', 89.28, NULL, 77.92, 'draft');
INSERT INTO animals (name, description, weight, height, length, age, gender, color, image, species, breed, adoption_price, sponsor_price, collected, status) VALUES ('Encarnita', 'Eius illum incidunt tempora labore cupiditate.', 26.92, 21.39, 53.3, 12, 0, 'Coral', 'encarnita1.jpg', 'Dog', 'Beagle', 91.64, NULL, 30.99, 'draft');
INSERT INTO animals (name, description, weight, height, length, age, gender, color, image, species, breed, adoption_price, sponsor_price, collected, status) VALUES ('Marta', 'Ratione at cupiditate laborum quia impedit ab eum dicta inventore officia sint.', 24.61, 59.1, 94.37, 15, 1, 'Azul real', 'marta1.jpg', 'Dog', 'Labrador', 103.75, NULL, 51.41, 'requires_funding');
INSERT INTO animals (name, description, weight, height, length, age, gender, color, image, species, breed, adoption_price, sponsor_price, collected, status) VALUES ('Pedro', 'Eius fugit illum iure dolorum mollitia quaerat aliquam qui.', 24.84, 56.1, 81.57, 3, 1, 'Rosa', 'pedro1.jpg', 'Cat', 'Siamese', 102.04, NULL, 37.3, 'active');
INSERT INTO animals (name, description, weight, height, length, age, gender, color, image, species, breed, adoption_price, sponsor_price, collected, status) VALUES ('Leocadio', 'Atque modi non harum dolores numquam.', 10.94, 42.09, 41.54, 10, 1, 'Oro', 'leocadio1.jpg', 'Dog', 'Labrador', 94.52, NULL, 2.31, 'requires_funding');
INSERT INTO animals (name, description, weight, height, length, age, gender, color, image, species, breed, adoption_price, sponsor_price, collected, status) VALUES ('Isidro', 'Eaque veniam architecto repudiandae odit sed tenetur neque accusantium at.', 11.62, 61.83, 70.74, 11, 0, 'Rojo', 'isidro1.jpg', 'Cat', 'Maine Coon', 147.63, NULL, 68.26, 'draft');
INSERT INTO animals (name, description, weight, height, length, age, gender, color, image, species, breed, adoption_price, sponsor_price, collected, status) VALUES ('Inés', 'Nihil asperiores totam fuga veniam in quos perferendis odio quisquam deserunt.', 2.77, 52.55, 41.99, 13, 1, 'Bisque', 'inés1.jpg', 'Dog', 'Poodle', 86.54, NULL, 52.09, 'active');
INSERT INTO animals (name, description, weight, height, length, age, gender, color, image, species, breed, adoption_price, sponsor_price, collected, status) VALUES ('María Manuela', 'Occaecati quos quaerat assumenda laborum magni porro autem perspiciatis totam sed nihil voluptatum.', 21.68, 27.65, 90.86, 8, 0, 'Amarillo dorado oscuro', 'maría manuela1.jpg', 'Cat', 'Sphynx', 87.03, NULL, 21.66, 'requires_funding');
INSERT INTO animals (name, description, weight, height, length, age, gender, color, image, species, breed, adoption_price, sponsor_price, collected, status) VALUES ('Nacho', 'Fugiat blanditiis delectus vel in est deserunt.', 18.09, 48.68, 41.66, 2, 0, 'Rojo', 'nacho1.jpg', 'Dog', 'Beagle', 119.37, NULL, 0.63, 'draft');
INSERT INTO animals (name, description, weight, height, length, age, gender, color, image, species, breed, adoption_price, sponsor_price, collected, status) VALUES ('Néstor', 'Ad ipsam aliquid incidunt amet doloremque ut distinctio autem harum.', 14.94, 58.46, 55.22, 1, 0, 'Beige antiguo', 'néstor1.jpg', 'Dog', 'Poodle', 81.57, NULL, 86.91, 'active');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('saturnina1.jpg', 1, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('saturnina2.jpg', 1, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('saturnina3.jpg', 1, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('saturnina4.jpg', 1, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('soraya1.jpg', 2, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('soraya2.jpg', 2, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('soraya3.jpg', 2, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('soraya4.jpg', 2, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('chucho1.jpg', 3, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('chucho2.jpg', 3, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('chucho3.jpg', 3, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('chucho4.jpg', 3, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('amaya1.jpg', 4, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('amaya2.jpg', 4, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('amaya3.jpg', 4, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('amaya4.jpg', 4, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('azeneth1.jpg', 5, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('azeneth2.jpg', 5, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('azeneth3.jpg', 5, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('azeneth4.jpg', 5, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('bruno1.jpg', 6, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('bruno2.jpg', 6, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('bruno3.jpg', 6, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('bruno4.jpg', 6, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('adelia1.jpg', 7, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('adelia2.jpg', 7, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('adelia3.jpg', 7, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('adelia4.jpg', 7, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('aurelia1.jpg', 8, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('aurelia2.jpg', 8, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('aurelia3.jpg', 8, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('aurelia4.jpg', 8, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('victoriano1.jpg', 9, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('victoriano2.jpg', 9, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('victoriano3.jpg', 9, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('victoriano4.jpg', 9, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('teófila1.jpg', 10, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('teófila2.jpg', 10, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('teófila3.jpg', 10, '2025-06-03 22:58:01');
INSERT INTO animals_image (filename, animal_id, fecha_subida) VALUES ('teófila4.jpg', 10, '2025-06-03 22:58:01');