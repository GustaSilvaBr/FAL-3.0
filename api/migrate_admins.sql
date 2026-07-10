-- Migration: add can_manage_admins and created_at to admins table
-- Run once via phpMyAdmin or any MySQL client.

USE fabi7033_fal_2;

ALTER TABLE admins
  ADD COLUMN can_manage_admins TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN created_at        TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE admins
SET can_manage_admins = 1
WHERE email = 'gustavo.ferreira0821@gmail.com';
