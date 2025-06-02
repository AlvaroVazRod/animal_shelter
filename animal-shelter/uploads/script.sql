
DROP DATABASE IF EXISTS db_animal_shelter;
CREATE DATABASE db_animal_shelter;
USE db_animal_shelter;

-- Tabla de usuarios
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(32) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL,
  password CHAR(64) NOT NULL,
  name VARCHAR(100) NOT NULL,
  surname VARCHAR(100),
  phone VARCHAR(20),
  newsletter TINYINT(1) DEFAULT 0,
  role ENUM('USER', 'ADMIN') DEFAULT 'USER',
  image VARCHAR(255),
  status ENUM('active', 'inactive') DEFAULT 'active'
);

-- Tabla de animales
CREATE TABLE animals (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  weight DECIMAL(10,2),
  height DECIMAL(10,2),
  length DECIMAL(10,2),
  age INT,
  gender BOOLEAN,
  color VARCHAR(50),
  image VARCHAR(255),
  species VARCHAR(50),
  breed VARCHAR(50),
  adoption_price DECIMAL(10,2) NOT NULL,
  sponsor_price DECIMAL(10,2),
  collected DECIMAL(10,2) DEFAULT 0.00,
  status ENUM('draft', 'active', 'adopted', 'requires_funding') DEFAULT 'draft',
  arrival_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  stripe_product_id VARCHAR(100),
  stripe_price_id VARCHAR(100)
);

-- Tabla de imágenes de animales
CREATE TABLE animals_image (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  animal_id INT UNSIGNED,
  fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE SET NULL
);

-- Tabla de etiquetas
CREATE TABLE tags (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(50) NOT NULL,
  icon VARCHAR(255)
);

-- Relación animal-tag
CREATE TABLE animals_tags (
  id_animal INT UNSIGNED NOT NULL,
  id_tag INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_animal, id_tag),
  FOREIGN KEY (id_animal) REFERENCES animals(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_tag) REFERENCES tags(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de donaciones
CREATE TABLE donations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  quantity DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  status ENUM('refunded', 'cancelled', 'failed', 'completed') NOT NULL,
  stripe_payment_intent_id VARCHAR(50) NOT NULL,
  id_user INT UNSIGNED,
  id_animal INT UNSIGNED,
  date DATETIME NOT NULL,
  FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_animal) REFERENCES animals(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabla de apadrinamientos
CREATE TABLE sponsors (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  quantity DECIMAL(10,2) NOT NULL,
  status ENUM('refunded', 'cancelled', 'failed', 'completed') NOT NULL,
  stripe_ref VARCHAR(50) NOT NULL,
  id_user INT UNSIGNED,
  id_animal INT UNSIGNED,
  FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_animal) REFERENCES animals(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabla de formularios
CREATE TABLE forms (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  formdata TEXT NOT NULL
);

-- Tabla de adopciones
CREATE TABLE adoptions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  quantity DECIMAL(10,2) NOT NULL,
  status ENUM('refunded', 'cancelled', 'failed', 'completed') NOT NULL,
  data DATE NOT NULL,
  stripe_ref VARCHAR(50) NOT NULL,
  id_user INT UNSIGNED,
  id_animal INT UNSIGNED,
  id_form INT UNSIGNED,
  FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_animal) REFERENCES animals(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_form) REFERENCES forms(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE webhook_log (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  raw_payload LONGTEXT NOT NULL,
  received_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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