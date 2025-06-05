CREATE TABLE vouchers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    voucher_type ENUM('shipping', 'product') NOT NULL,
    discount_type ENUM('percent', 'fixed') NOT NULL,
    discount_value DECIMAL(10,0) NOT NULL,
    min_order_value DECIMAL(10,0) DEFAULT 0,
    max_discount_value DECIMAL(10,0),
    quantity INT DEFAULT 1,
    used INT DEFAULT 0,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);