-- =============================================
-- DATOS DE EJEMPLO PARA CATÁLOGOS
-- =============================================

-- Insertar tipos de ropa
INSERT INTO cat_tipos_ropa (nombre, descripcion) VALUES
('Uniforme de trabajo', 'Uniforme estándar para bomberos'),
('Chaleco reflectante', 'Chaleco de alta visibilidad'),
('Pantalón de trabajo', 'Pantalón resistente al fuego'),
('Camisa de trabajo', 'Camisa de algodón resistente'),
('Gorra de trabajo', 'Gorra con logo de la brigada');

-- Insertar equipamiento EPP
INSERT INTO cat_equipamiento_epp (nombre, descripcion) VALUES
('Casco de seguridad', 'Casco certificado para bomberos'),
('Máscara de respiración', 'Máscara con filtros de aire'),
('Guantes de protección', 'Guantes resistentes al calor'),
('Botas de seguridad', 'Botas con punta de acero'),
('Gafas de protección', 'Gafas resistentes a impactos'),
('Arnés de seguridad', 'Arnés para trabajos en altura');

-- Insertar herramientas
INSERT INTO cat_herramientas (nombre, descripcion) VALUES
('Hacha de bombero', 'Hacha especializada para rescate'),
('Pico', 'Herramienta para demolición'),
('Palas', 'Palas para remoción de escombros'),
('Motosierra', 'Sierra para cortar madera'),
('Extintores', 'Extintores portátiles'),
('Mangueras', 'Mangueras de diferentes diámetros'),
('Escaleras', 'Escaleras de extensión'),
('Cuerdas', 'Cuerdas de rescate');

-- Insertar servicios de vehículos
INSERT INTO cat_servicios_vehiculos (nombre, descripcion) VALUES
('Mantenimiento preventivo', 'Servicio de mantenimiento regular'),
('Cambio de aceite', 'Cambio de aceite y filtros'),
('Reparación de frenos', 'Servicio de sistema de frenos'),
('Reparación de motor', 'Reparaciones del motor'),
('Cambio de neumáticos', 'Cambio y balanceo de neumáticos'),
('Reparación eléctrica', 'Sistema eléctrico del vehículo'),
('Limpieza de combustible', 'Limpieza del sistema de combustible');

-- Insertar alimentos y bebidas
INSERT INTO cat_alimentos_bebidas (nombre, descripcion) VALUES
('Agua embotellada', 'Agua potable en botellas'),
('Bebidas energéticas', 'Bebidas con electrolitos'),
('Galletas', 'Galletas energéticas'),
('Frutas', 'Frutas frescas'),
('Sándwiches', 'Sándwiches preparados'),
('Café', 'Café instantáneo'),
('Té', 'Té en bolsitas'),
('Chocolate', 'Chocolate para energía');

-- Insertar equipo de campo
INSERT INTO cat_equipo_campo (nombre, descripcion) VALUES
('Tiendas de campaña', 'Tiendas para refugio temporal'),
('Sacos de dormir', 'Sacos de dormir para descanso'),
('Linternas', 'Linternas de mano y de cabeza'),
('Baterías', 'Baterías recargables'),
('Generadores', 'Generadores portátiles'),
('Bombas de agua', 'Bombas para extracción de agua'),
('Comunicadores', 'Radios de comunicación'),
('GPS', 'Dispositivos de navegación');

-- Insertar productos de limpieza personal
INSERT INTO cat_limpieza_personal (nombre, descripcion) VALUES
('Jabón', 'Jabón antibacterial'),
('Shampoo', 'Shampoo para cabello'),
('Pasta dental', 'Pasta dental y cepillos'),
('Desodorante', 'Desodorante personal'),
('Toallas', 'Toallas de baño'),
('Papel higiénico', 'Papel higiénico'),
('Cepillos de dientes', 'Cepillos de dientes desechables'),
('Crema dental', 'Crema dental en tubos');

-- Insertar productos de limpieza general
INSERT INTO cat_limpieza_general (nombre, descripcion) VALUES
('Detergente', 'Detergente para ropa'),
('Limpia pisos', 'Producto para limpiar pisos'),
('Desinfectante', 'Desinfectante general'),
('Jabón líquido', 'Jabón líquido para manos'),
('Trapo', 'Trapo para limpieza'),
('Escobas', 'Escobas para limpieza'),
('Cubetas', 'Cubetas para agua'),
('Guantes de limpieza', 'Guantes para limpieza');

-- Insertar medicamentos
INSERT INTO cat_medicamentos (nombre, descripcion) VALUES
('Paracetamol', 'Analgésico y antipirético'),
('Ibuprofeno', 'Antiinflamatorio no esteroideo'),
('Aspirina', 'Analgésico y anticoagulante'),
('Antihistamínico', 'Para reacciones alérgicas'),
('Antiácido', 'Para problemas estomacales'),
('Vendas', 'Vendas adhesivas'),
('Gasas', 'Gasas estériles'),
('Alcohol', 'Alcohol para desinfección'),
('Yodo', 'Antiséptico tópico'),
('Tijeras médicas', 'Tijeras para vendajes');

-- Insertar alimentos para animales
INSERT INTO cat_alimentos_animales (nombre, descripcion) VALUES
('Comida para perros', 'Alimento seco para perros'),
('Comida para gatos', 'Alimento seco para gatos'),
('Leche en polvo', 'Leche en polvo para crías'),
('Agua para mascotas', 'Agua potable para animales'),
('Golosinas para perros', 'Premios para perros'),
('Comida húmeda', 'Alimento húmedo para mascotas'),
('Vitaminas', 'Suplementos vitamínicos'),
('Juguetes', 'Juguetes para distracción');

-- =============================================
-- MENSAJE DE CONFIRMACIÓN
-- =============================================

DO $$
BEGIN
    RAISE NOTICE 'Datos de ejemplo insertados exitosamente';
    RAISE NOTICE 'Catálogos poblados con información básica';
 