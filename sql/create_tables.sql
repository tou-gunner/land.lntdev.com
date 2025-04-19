-- PostgreSQL Database Schema for Land LNT Dev

-- Create cadastre schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS cadastre;

-- Create users_2 table
CREATE TABLE cadastre.users_2 (
  gid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(255) UNIQUE,
  password VARCHAR(255) NOT NULL,
  fullname VARCHAR(255),
  role VARCHAR(255) NOT NULL DEFAULT 'page grouping',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL
);

-- Create grouping table
CREATE TABLE cadastre.grouping (
  gid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  barcode VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL
);

-- Add trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION cadastre.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to tables
CREATE TRIGGER update_users_2_modtime
BEFORE UPDATE ON cadastre.users_2
FOR EACH ROW
EXECUTE FUNCTION cadastre.update_modified_column();

CREATE TRIGGER update_grouping_modtime
BEFORE UPDATE ON cadastre.grouping
FOR EACH ROW
EXECUTE FUNCTION cadastre.update_modified_column(); 