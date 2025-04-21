-- Drop tables in reverse order of creation to avoid foreign key constraint issues
DROP TABLE IF EXISTS service_orders;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;