BEGIN;

-- =========================
-- USERS
-- =========================
INSERT INTO user_profiles (user_id, first_name, last_name, email, date_of_birth)
SELECT 
    'user_' || i,
    'First' || i,
    'Last' || i,
    'user' || i || '@example.com',
    DATE '1990-01-01' + (i * INTERVAL '200 days')
FROM generate_series(1, 10) i;

INSERT INTO user_logins (user_id, email, password_hash, role)
SELECT 
    user_id,
    email,
    '$2b$12$hashedpasswordexample',
    CASE WHEN random() > 0.8 THEN 'admin' ELSE 'user' END
FROM user_profiles;

INSERT INTO user_sessions (session_id, user_id, access_token, expires_at)
SELECT 
    'sess_' || i,
    'user_' || ((i % 10) + 1),
    md5(random()::text),
    NOW() + INTERVAL '1 day'
FROM generate_series(1, 20) i;

-- =========================
-- VENDORS
-- =========================
INSERT INTO vendors (vendor_id, vendor_name, contact_email, contact_phone)
SELECT
    'vendor_' || i,
    'Vendor ' || i,
    'vendor' || i || '@shop.com',
    '99999' || lpad(i::text, 5, '0')
FROM generate_series(1, 10) i;

-- =========================
-- PRODUCTS
-- =========================
INSERT INTO products (
    product_id, slug, brand, product_name, description,
    thumbnail_url, vendor_id, mrp, selling_price,
    currency, category_slug, stock
)
SELECT
    'prod_' || i,
    'product-' || i,
    'Brand ' || (i % 10),
    'Product ' || i,
    'Description for product ' || i,
    'https://example.com/img' || i || '.jpg',
    'vendor_' || ((i % 10) + 1),
    (100 + i * 5),
    (80 + i * 4),
    'INR',
    'category-' || (i % 5),
    (10 + (i % 50))
FROM generate_series(1, 100) i;

-- =========================
-- PRODUCT IMAGES
-- =========================
INSERT INTO product_images (image_id, product_id, image_url, sort_order)
SELECT
    'img_' || i,
    'prod_' || ((i % 100) + 1),
    'https://example.com/product_' || i || '.jpg',
    (i % 3)
FROM generate_series(1, 200) i;

-- =========================
-- PRODUCT REVIEWS
-- =========================
INSERT INTO product_reviews (review_id, product_id, user_id, rating, review_text)
SELECT
    'rev_' || i,
    'prod_' || ((i % 100) + 1),
    'user_' || ((i % 10) + 1),
    (1 + (i % 5)),
    'Review text ' || i
FROM generate_series(1, 300) i;

-- =========================
-- ORDERS
-- =========================
INSERT INTO orders (
    order_id, user_id, order_amount, order_status, delivery_address
)
SELECT
    'order_' || i,
    'user_' || ((i % 10) + 1),
    (500 + i * 20),
    CASE 
        WHEN i % 5 = 0 THEN 'DELIVERED'
        WHEN i % 4 = 0 THEN 'SHIPPED'
        WHEN i % 3 = 0 THEN 'CANCELLED'
        ELSE 'PLACED'
    END,
    'Address ' || i
FROM generate_series(1, 30) i;

-- =========================
-- ORDER ITEMS
-- =========================
INSERT INTO order_items (
    order_item_id, order_id, product_id, quantity, price
)
SELECT
    'oi_' || i,
    'order_' || ((i % 30) + 1),
    'prod_' || ((i % 100) + 1),
    (1 + (i % 3)),
    (100 + i * 2)
FROM generate_series(1, 100) i;

-- =========================
-- ORDER EVENTS
-- =========================
INSERT INTO order_events (event_id, order_id, event_type, payload)
SELECT
    'oe_' || i,
    'order_' || ((i % 30) + 1),
    CASE 
        WHEN i % 3 = 0 THEN 'CREATED'
        WHEN i % 3 = 1 THEN 'UPDATED'
        ELSE 'CANCELLED'
    END,
    jsonb_build_object('info', 'event ' || i)
FROM generate_series(1, 90) i;

-- =========================
-- SHIPMENTS
-- =========================
INSERT INTO shipments (
    shipment_id, order_id, shipment_status, estimated_delivery_date
)
SELECT
    'ship_' || i,
    'order_' || i,
    CASE 
        WHEN i % 3 = 0 THEN 'DELIVERED'
        WHEN i % 2 = 0 THEN 'IN_TRANSIT'
        ELSE 'PENDING'
    END,
    CURRENT_DATE + (i % 7)
FROM generate_series(1, 30) i;

-- =========================
-- PAYMENTS
-- =========================
INSERT INTO payments (
    payment_id, order_id, payment_status, payment_method, transaction_id, amount
)
SELECT
    'pay_' || i,
    'order_' || i,
    CASE 
        WHEN i % 4 = 0 THEN 'FAILED'
        ELSE 'SUCCESS'
    END,
    CASE 
        WHEN i % 3 = 0 THEN 'UPI'
        WHEN i % 3 = 1 THEN 'CARD'
        ELSE 'COD'
    END,
    md5(i::text),
    (500 + i * 20)
FROM generate_series(1, 30) i;

-- =========================
-- SHIPMENT CHECKPOINTS
-- =========================
INSERT INTO shipment_checkpoints (
    checkpoint_id, shipment_id, checkpoint_location, checkpoint_status, message
)
SELECT
    'cp_' || i,
    'ship_' || ((i % 30) + 1),
    'Location ' || i,
    'STATUS_' || (i % 3),
    'Checkpoint message ' || i
FROM generate_series(1, 90) i;

-- =========================
-- SHIPMENT EVENTS
-- =========================
INSERT INTO shipment_events (event_id, shipment_id, event_type, payload)
SELECT
    'se_' || i,
    'ship_' || ((i % 30) + 1),
    'EVENT_' || (i % 4),
    jsonb_build_object('detail', 'shipment event ' || i)
FROM generate_series(1, 90) i;

-- =========================
-- UPDATE PRODUCT RATINGS
-- =========================
UPDATE products p
SET 
    rating_average = sub.avg_rating,
    rating_count = sub.cnt
FROM (
    SELECT product_id, AVG(rating) avg_rating, COUNT(*) cnt
    FROM product_reviews
    GROUP BY product_id
) sub
WHERE p.product_id = sub.product_id;

COMMIT;