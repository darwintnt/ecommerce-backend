-- Insertar productos solo si la tabla está vacía
INSERT INTO products (id, name, description, price, stock, sku, "createdAt", "updatedAt")
SELECT * FROM (
  VALUES
    (gen_random_uuid(), 'Laptop HP Pavilion 15', 'Laptop con procesador Intel Core i5, 8GB RAM, 256GB SSD', 3599900, 15, 'LAP-HP-001', NOW(), NOW()),
    (gen_random_uuid(), 'Mouse Logitech MX Master 3', 'Mouse ergonómico inalámbrico con sensor de alta precisión', 399900, 50, 'MOU-LOG-001', NOW(), NOW()),
    (gen_random_uuid(), 'Teclado Mecánico Keychron K2', 'Teclado mecánico inalámbrico con switches Brown', 359900, 30, 'KEY-KEY-001', NOW(), NOW()),
    (gen_random_uuid(), 'Monitor Dell 27" 4K', 'Monitor 4K UHD de 27 pulgadas con panel IPS', 1799900, 20, 'MON-DEL-001', NOW(), NOW()),
    (gen_random_uuid(), 'Webcam Logitech C920', 'Webcam Full HD 1080p con micrófono integrado', 319900, 40, 'WEB-LOG-001', NOW(), NOW()),
    (gen_random_uuid(), 'Auriculares Sony WH-1000XM4', 'Auriculares inalámbricos con cancelación de ruido activa', 1399900, 25, 'AUR-SON-001', NOW(), NOW()),
    (gen_random_uuid(), 'Disco Duro Externo Seagate 2TB', 'Disco duro portátil USB 3.0 de 2TB', 279900, 60, 'HDD-SEA-001', NOW(), NOW()),
    (gen_random_uuid(), 'SSD Samsung 970 EVO 1TB', 'SSD NVMe M.2 de alta velocidad', 519900, 35, 'SSD-SAM-001', NOW(), NOW()),
    (gen_random_uuid(), 'Router TP-Link AX3000', 'Router WiFi 6 de doble banda', 599900, 28, 'ROU-TPL-001', NOW(), NOW()),
    (gen_random_uuid(), 'Tablet Samsung Galaxy Tab S8', 'Tablet Android de 11 pulgadas con S Pen incluido', 2799900, 18, 'TAB-SAM-001', NOW(), NOW()),
    (gen_random_uuid(), 'Impresora HP LaserJet Pro', 'Impresora láser monocromática con WiFi', 799900, 22, 'IMP-HP-001', NOW(), NOW()),
    (gen_random_uuid(), 'Cámara Web Razer Kiyo', 'Webcam Full HD con anillo de luz incorporado', 399900, 32, 'CAM-RAZ-001', NOW(), NOW()),
    (gen_random_uuid(), 'Hub USB-C Anker 7 en 1', 'Hub multipuerto con HDMI, USB 3.0 y lector de tarjetas', 199900, 45, 'HUB-ANK-001', NOW(), NOW()),
    (gen_random_uuid(), 'Micrófono Blue Yeti', 'Micrófono USB profesional para streaming y podcasting', 519900, 27, 'MIC-BLU-001', NOW(), NOW()),
    (gen_random_uuid(), 'Cable HDMI 4K Premium 2m', 'Cable HDMI 2.1 certificado para 4K a 120Hz', 79900, 100, 'CAB-HDM-001', NOW(), NOW()),
    (gen_random_uuid(), 'Soporte para Laptop Elevado', 'Soporte ergonómico ajustable de aluminio', 159900, 55, 'SOP-LAP-001', NOW(), NOW()),
    (gen_random_uuid(), 'Alfombrilla Gaming RGB XXL', 'Alfombrilla extendida con iluminación RGB personalizable', 119900, 70, 'ALF-GAM-001', NOW(), NOW()),
    (gen_random_uuid(), 'Power Bank Anker 20000mAh', 'Batería externa de carga rápida con USB-C', 219900, 48, 'POW-ANK-001', NOW(), NOW()),
    (gen_random_uuid(), 'Adaptador WiFi USB TP-Link', 'Adaptador inalámbrico dual band AC1300', 99900, 65, 'ADA-TPL-001', NOW(), NOW()),
    (gen_random_uuid(), 'Silla Gaming Secretlab Titan', 'Silla ergonómica premium para gaming y oficina', 1799900, 12, 'SIL-SEC-001', NOW(), NOW())
) AS seed_data
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);
