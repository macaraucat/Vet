CREATE DATABASE IF NOT EXISTS vet
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE vet;

CREATE TABLE usuarios (
                          id         BIGINT       NOT NULL AUTO_INCREMENT,
                          run        VARCHAR(9)   NOT NULL,
                          nombre     VARCHAR(30)  NOT NULL,
                          apellidos  VARCHAR(30)  NOT NULL,
                          email      VARCHAR(40)  NOT NULL,
                          password   VARCHAR(60)  NOT NULL,
                          fecha_nac  DATE         NULL,
                          region     VARCHAR(40)  NULL,
                          comuna     VARCHAR(30)  NULL,
                          direccion  VARCHAR(300) NULL,
                          rol        VARCHAR(13)  NOT NULL,
                          activo     TINYINT(1)   NOT NULL DEFAULT 1,
                          PRIMARY KEY (id),
                          UNIQUE KEY uk_usuarios_run (run),
                          UNIQUE KEY uk_usuarios_email (email),
                          CONSTRAINT chk_usuarios_rol CHECK (rol IN ('CLIENTE', 'FUNCIONARIO', 'ADMINISTRADOR'))
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;