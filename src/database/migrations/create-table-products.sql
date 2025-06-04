CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    category ENUM('iPhone', 'MacBook', 'iPad', 'Apple Watch', 'AirPods', 'Accessories') NOT NULL,
    description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    price DECIMAL(15, 2) NOT NULL,
    discount_percent DECIMAL(15, 2) DEFAULT NULL,
    stock_quantity INT DEFAULT 0,
    color VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    color_background VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    storage VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    sku VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci UNIQUE NOT NULL UNIQUE,
    status ENUM('active', 'inactive', 'out_of_stock') DEFAULT 'active',
    flash_sale BOOLEAN DEFAULT FALSE,
    flash_sale_percent INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);
