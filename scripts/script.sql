SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
CREATE DATABASE IF NOT EXISTS db_animal_shelter
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
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