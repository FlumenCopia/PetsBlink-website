CREATE TABLE IF NOT EXISTS profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  company_name VARCHAR(100) NOT NULL,
  tagline VARCHAR(100),
  about TEXT NOT NULL,
  services_offered LONGTEXT,
  specializations LONGTEXT,
  industries_served LONGTEXT,
  service_locations VARCHAR(100),
  business_email VARCHAR(100) NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  website VARCHAR(255),
  address_line1 VARCHAR(255) NOT NULL,
  brand_hashtags LONGTEXT,
  social_profiles LONGTEXT,
  logo_url VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_profiles_user_id (user_id),
  CONSTRAINT fk_profiles_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);
