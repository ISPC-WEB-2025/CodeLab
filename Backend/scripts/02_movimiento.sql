USE todostock;
DROP TABLE IF EXISTS MOVIMIENTO;

CREATE TABLE MOVIMIENTO (
    id_mov       INT          NOT NULL AUTO_INCREMENT,
    tipo         ENUM('Entrada','Salida','Traslado') NOT NULL,
    fecha_hora   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    stock_previo INT          NULL,
    cantidad     INT          NOT NULL,
    motivo       VARCHAR(255) NULL,
    id_art       INT          NOT NULL,
    id_suc       INT          NOT NULL,
    id_prov      INT          NULL,
    id_usuario   BIGINT       NULL,
    PRIMARY KEY (id_mov),
    CONSTRAINT fk_mov_producto
        FOREIGN KEY (id_art) REFERENCES PRODUCTO (id_art),
    CONSTRAINT fk_mov_sucursal
        FOREIGN KEY (id_suc) REFERENCES SUCURSAL (id_suc),
    CONSTRAINT fk_mov_proveedor
        FOREIGN KEY (id_prov) REFERENCES PROVEEDOR (id_prov),
    CONSTRAINT fk_mov_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios_usuario (id)
);