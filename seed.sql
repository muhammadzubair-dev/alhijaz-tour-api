INSERT INTO package_types (name, "desc", created_by, updated_by, created_at, updated_at)
VALUES 
  ('Standard', 'Paket Standard', null, null, NOW(), NOW()),
  ('UHUD', 'Paket Uhud', null, null, NOW(), NOW()),
  ('RAHMAH', 'Paket Rahmah', null, null, NOW(), NOW()),
  ('HEMAT', 'Paket Hemat', null, null, NOW(), NOW()),
  ('WAITING LIST', 'Paket Waiting', null, null, NOW(), NOW());

INSERT INTO room_types (name, "desc", created_by, updated_by, created_at, updated_at)
VALUES 
  ('Single', 'Tipe Single', null, null, NOW(), NOW()),
  ('Double', 'Tipe Double', null, null, NOW(), NOW()),
  ('Triple', 'Tipe Triple', null, null, NOW(), NOW()),
  ('Quard', 'Tipe Quard', null, null, NOW(), NOW()),
  ('Quint', 'Tipe Quint', null, null, NOW(), NOW());

INSERT INTO citys (name, status, created_by, updated_by, created_at, updated_at)
VALUES 
  ('Madinah', '1',null,null, NOW(), NOW()),
  ('Mekkah', '1',null,null, NOW(), NOW()),
  ('Bursa', '1',null,null, NOW(), NOW()),
  ('Istanbul', '1',null,null, NOW(), NOW()),
  ('Dubai', '1',null,null, NOW(), NOW()),
  ('Cappadocia', '1',null,null, NOW(), NOW()),
  ('Ankara', '1',null,null, NOW(), NOW()),
  ('Cairo', '1',null,null, NOW(), NOW());

INSERT INTO hotels (name, stars, photo, city_id, status, created_by, updated_by, created_at, updated_at) VALUES
-- Madinah
('Dar Al Hijra InterContinental', '5', 'https://example.com/hotel1.jpg', 1, '1', null, null, NOW(), NOW()),
('New Madinah Hotel', '4', 'https://example.com/hotel2.jpg', 1, '1', null, null, NOW(), NOW()),
('Crowne Plaza Madinah', '4', 'https://example.com/hotel3.jpg', 1, '1', null, null, NOW(), NOW()),
-- Mekkah
('Le Méridien Towers Makkah', '3', 'https://example.com/hotel4.jpg', 2, '1', null, null, NOW(), NOW()),
('Al Kiswah Towers Hotel', '3', 'https://example.com/hotel5.jpg', 2, '1', null, null, NOW(), NOW()),
('Diouf Al Maqam Hotel', '3', 'https://example.com/hotel6.jpg', 2, '1', null, null, NOW(), NOW()),
-- Bursa
('Ibis Styles Bursa', '3', 'https://example.com/hotel7.jpg', 3, '1', null, null, NOW(), NOW()),
('Holiday Inn Bursa', '4', 'https://example.com/hotel8.jpg', 3, '1', null, null, NOW(), NOW()),
('Sheraton Bursa Hotel', '5', 'https://example.com/hotel9.jpg', 3, '1', null, null, NOW(), NOW()),
-- Istanbul
('Ibis Istanbul', '3', 'https://example.com/hotel10.jpg', 4, '1', null, null, NOW(), NOW()),
('Holiday Inn Istanbul', '4', 'https://example.com/hotel11.jpg', 4, '1', null, null, NOW(), NOW()),
('Sheraton Istanbul', '5', 'https://example.com/hotel12.jpg', 4, '1', null, null, NOW(), NOW()),
-- Dubai
('Holiday Inn Express Jumeirah', '3', 'https://example.com/hotel13.jpg', 5, '1', null, null, NOW(), NOW()),
('Rose Plaza Hotel Al Barsha', '3', 'https://example.com/hotel14.jpg', 5, '1', null, null, NOW(), NOW()),
('Ibis Al Rigga Dubai', '3', 'https://example.com/hotel15.jpg', 5, '1', null, null, NOW(), NOW()),
-- Cappadocia
('Mithra Cave Hotel', '4', 'https://example.com/hotel16.jpg', 6, '1', null, null, NOW(), NOW()),
('Sultan Cave Suites', '4', 'https://example.com/hotel17.jpg', 6, '1', null, null, NOW(), NOW()),
('Museum Hotel', '5', 'https://example.com/hotel18.jpg', 6, '1', null, null, NOW(), NOW()),
-- Ankara
('Hotel Ickale', '4', 'https://example.com/hotel19.jpg', 7, '1', null, null, NOW(), NOW()),
('Point Hotel Ankara', '5', 'https://example.com/hotel20.jpg', 7, '1', null, null, NOW(), NOW()),
('Ankara HiltonSA', '5', 'https://example.com/hotel21.jpg', 7, '1', null, null, NOW(), NOW()),
-- Cairo
('Ramses Hilton', '5', 'https://example.com/hotel22.jpg', 8, '1', null, null, NOW(), NOW()),
('Kempinski Nile Hotel', '5', 'https://example.com/hotel23.jpg', 8, '1', null, null, NOW(), NOW()),
('Fairmont Nile City', '5', 'https://example.com/hotel24.jpg', 8, '1', null, null, NOW(), NOW());

INSERT INTO package_rooms (package_type_id, room_type_id, status, created_by, updated_by, created_at, updated_at)
VALUES
  (6, 1, '1', null, null, NOW(), NOW()),
  (6, 2, '1', null, null, NOW(), NOW()),
  (6, 3, '1', null, null, NOW(), NOW()),
  (6, 4, '1', null, null, NOW(), NOW()),
  (6, 5, '1', null, null, NOW(), NOW()),

  (7, 1, '1', null, null, NOW(), NOW()),
  (7, 2, '1', null, null, NOW(), NOW()),
  (7, 3, '1', null, null, NOW(), NOW()),
  (7, 4, '1', null, null, NOW(), NOW()),
  (7, 5, '1', null, null, NOW(), NOW()),

  (8, 1, '1', null, null, NOW(), NOW()),
  (8, 2, '1', null, null, NOW(), NOW()),
  (8, 3, '1', null, null, NOW(), NOW()),
  (8, 4, '1', null, null, NOW(), NOW()),
  (8, 5, '1', null, null, NOW(), NOW()),

  (9, 1, '1', null, null, NOW(), NOW()),
  (9, 2, '1', null, null, NOW(), NOW()),
  (9, 3, '1', null, null, NOW(), NOW()),
  (9, 4, '1', null, null, NOW(), NOW()),
  (9, 5, '1', null, null, NOW(), NOW()),

  (10, 1, '1', null, null, NOW(), NOW()),
  (10, 2, '1', null, null, NOW(), NOW()),
  (10, 3, '1', null, null, NOW(), NOW()),
  (10, 4, '1', null, null, NOW(), NOW()),
  (10, 5, '1', null, null, NOW(), NOW());