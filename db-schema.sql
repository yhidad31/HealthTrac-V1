-- create table patients
CREATE TABLE patients (
   id SERIAL PRIMARY KEY,
   name VARCHAR(50) NOT NULL,
   email VARCHAR (355) UNIQUE NOT NULL,
   sub VARCHAR (355) UNIQUE NOT NULL,
   is_patient BOOLEAN NOT NULL,
   doctor_id INTEGER REFERENCES doctors(id) ON DELETE SET NULL
);
​
-- create table doctors
CREATE TABLE doctors (
   id SERIAL PRIMARY KEY,
   name VARCHAR(50) NOT NULL,
   email VARCHAR (355) UNIQUE NOT NULL,
   sub VARCHAR (355) UNIQUE NOT NULL,
   is_patient BOOLEAN NOT NULL
);
​
-- create table heartrate
CREATE TABLE IF NOT EXISTS heartrate_seconds_merged (
   id SERIAL PRIMARY KEY,
   Time TIMESTAMP,
   Value INTEGER,
   patient_id INTEGER REFERENCES patients(id) ON DELETE SET NULL
);