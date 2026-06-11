-- Run this once in cPanel → phpMyAdmin to create the tables

CREATE TABLE IF NOT EXISTS admins (
    email         VARCHAR(255) PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    createdAt     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS folders (
    id        VARCHAR(36) PRIMARY KEY,
    name      VARCHAR(255) NOT NULL,
    `order`   INT DEFAULT 0,
    parentId  VARCHAR(36) NULL,
    keywords  JSON NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id        VARCHAR(36) PRIMARY KEY,
    name      VARCHAR(255) NOT NULL,
    weight    VARCHAR(50) DEFAULT '',
    folderId  VARCHAR(36) NOT NULL,
    imageUrl  TEXT DEFAULT '',
    imagePath VARCHAR(500) DEFAULT '',
    nutrition JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sections (
    id        VARCHAR(50) PRIMARY KEY,
    data      JSON NOT NULL,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
