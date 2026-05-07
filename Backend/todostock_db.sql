-- ============================================
--   TodoStock - Script de Base de Datos MySQL
-- ============================================

CREATE DATABASE IF NOT EXISTS todostock
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE todostock;

-- ============================================
--   CATEGORÍA
-- ============================================
CREATE TABLE CATEGORIA (
    id_cat  INT          NOT NULL AUTO_INCREMENT,
    nombre  VARCHAR(100) NOT NULL,
    PRIMARY KEY (id_cat)
);

-- ============================================
--   PROVEEDOR
-- ============================================
CREATE TABLE PROVEEDOR (
    id_prov   INT          NOT NULL AUTO_INCREMENT,
    nombre    VARCHAR(200) NOT NULL,
    cuit      VARCHAR(20)  NOT NULL,
    telefono  VARCHAR(30)  NOT NULL,
    email     VARCHAR(150) NOT NULL,
    direccion VARCHAR(300) NOT NULL,
    PRIMARY KEY (id_prov),
    UNIQUE KEY uq_proveedor_cuit (cuit)
);

-- ============================================
--   SUCURSAL
-- ============================================
CREATE TABLE SUCURSAL (
    id_suc    INT          NOT NULL AUTO_INCREMENT,
    nombre    VARCHAR(100) NOT NULL,
    direccion VARCHAR(300) NOT NULL,
    PRIMARY KEY (id_suc)
);

-- ============================================
--   PRODUCTO
-- ============================================
CREATE TABLE PRODUCTO (
    id_art      INT            NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(200)   NOT NULL,
    descripcion TEXT           NULL,
    codigo      VARCHAR(50)    NOT NULL,
    precio_venta DECIMAL(10,2) NULL,
    id_cat      INT            NOT NULL,
    PRIMARY KEY (id_art),
    UNIQUE KEY uq_producto_codigo (codigo),
    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (id_cat) REFERENCES CATEGORIA (id_cat)
);

-- ============================================
--   PRODUCTO_PROVEEDOR
-- ============================================
CREATE TABLE PRODUCTO_PROVEEDOR (
    id_enlace   INT            NOT NULL AUTO_INCREMENT,
    id_art      INT            NOT NULL,
    id_prov     INT            NOT NULL,
    precio_costo DECIMAL(10,2) NULL,
    PRIMARY KEY (id_enlace),
    CONSTRAINT fk_pp_producto
        FOREIGN KEY (id_art)  REFERENCES PRODUCTO  (id_art),
    CONSTRAINT fk_pp_proveedor
        FOREIGN KEY (id_prov) REFERENCES PROVEEDOR (id_prov)
);

-- ============================================
--   STOCK_SUCURSAL
-- ============================================
CREATE TABLE STOCK_SUCURSAL (
    id_stock       INT NOT NULL AUTO_INCREMENT,
    cantidad_stock INT NOT NULL DEFAULT 0,
    stock_min      INT NOT NULL DEFAULT 0,
    id_art         INT NOT NULL,
    id_suc         INT NOT NULL,
    PRIMARY KEY (id_stock),
    CONSTRAINT fk_stock_producto
        FOREIGN KEY (id_art) REFERENCES PRODUCTO (id_art),
    CONSTRAINT fk_stock_sucursal
        FOREIGN KEY (id_suc) REFERENCES SUCURSAL (id_suc)
);

-- ============================================
--   MOVIMIENTO
-- ============================================
CREATE TABLE MOVIMIENTO (
    id_mov     INT                                     NOT NULL AUTO_INCREMENT,
    tipo       ENUM('Entrada', 'Salida', 'Traslado')   NOT NULL,
    fecha_hora DATETIME                                NOT NULL,
    cantidad   INT                                     NOT NULL,
    motivo     VARCHAR(255)                            NULL,
    id_art     INT                                     NOT NULL,
    id_suc     INT                                     NOT NULL,
    id_prov    INT                                     NULL,
    PRIMARY KEY (id_mov),
    CONSTRAINT fk_mov_producto
        FOREIGN KEY (id_art)  REFERENCES PRODUCTO  (id_art),
    CONSTRAINT fk_mov_sucursal
        FOREIGN KEY (id_suc)  REFERENCES SUCURSAL  (id_suc),
    CONSTRAINT fk_mov_proveedor
        FOREIGN KEY (id_prov) REFERENCES PROVEEDOR (id_prov)
);
