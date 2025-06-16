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
  (1, 1, '1', null, null, NOW(), NOW()),
  (1, 2, '1', null, null, NOW(), NOW()),
  (1, 3, '1', null, null, NOW(), NOW()),
  (1, 4, '1', null, null, NOW(), NOW()),
  (1, 5, '1', null, null, NOW(), NOW()),
  (2, 1, '1', null, null, NOW(), NOW()),
  (2, 2, '1', null, null, NOW(), NOW()),
  (2, 3, '1', null, null, NOW(), NOW()),
  (2, 4, '1', null, null, NOW(), NOW()),
  (2, 5, '1', null, null, NOW(), NOW()),
  (3, 1, '1', null, null, NOW(), NOW()),
  (3, 2, '1', null, null, NOW(), NOW()),
  (3, 3, '1', null, null, NOW(), NOW()),
  (3, 4, '1', null, null, NOW(), NOW()),
  (3, 5, '1', null, null, NOW(), NOW()),
  (4, 1, '1', null, null, NOW(), NOW()),
  (4, 2, '1', null, null, NOW(), NOW()),
  (4, 3, '1', null, null, NOW(), NOW()),
  (4, 4, '1', null, null, NOW(), NOW()),
  (4, 5, '1', null, null, NOW(), NOW()),
  (5, 1, '1', null, null, NOW(), NOW()),
  (5, 2, '1', null, null, NOW(), NOW()),
  (5, 3, '1', null, null, NOW(), NOW()),
  (5, 4, '1', null, null, NOW(), NOW()),
  (5, 5, '1', null, null, NOW(), NOW());

INSERT INTO provinces (name, status, created_by, created_at, updated_by, updated_at)
VALUES
  ('Aceh', '1', null, NOW(), null, NOW()),
  ('Sumatera Utara', '1', null, NOW(), null, NOW()),
  ('Sumatera Selatan', '1', null, NOW(), null, NOW()),
  ('Sumatera Barat', '1', null, NOW(), null, NOW()),
  ('Bengkulu', '1', null, NOW(), null, NOW()),
  ('Riau', '1', null, NOW(), null, NOW()),
  ('Kepulauan Riau', '1', null, NOW(), null, NOW()),
  ('Jambi', '1', null, NOW(), null, NOW()),
  ('Lampung', '1', null, NOW(), null, NOW()),
  ('Bangka Belitung', '1', null, NOW(), null, NOW()),
  ('Kalimantan Barat', '1', null, NOW(), null, NOW()),
  ('Kalimantan Timur', '1', null, NOW(), null, NOW()),
  ('Kalimantan Selatan', '1', null, NOW(), null, NOW()),
  ('Kalimantan Tengah', '1', null, NOW(), null, NOW()),
  ('Kalimantan Utara', '1', null, NOW(), null, NOW()),
  ('Banten', '1', null, NOW(), null, NOW()),
  ('DKI Jakarta', '1', null, NOW(), null, NOW()),
  ('Jawa Barat', '1', null, NOW(), null, NOW()),
  ('Jawa Tengah', '1', null, NOW(), null, NOW()),
  ('DI Yogyakarta', '1', null, NOW(), null, NOW()),
  ('Jawa Timur', '1', null, NOW(), null, NOW()),
  ('Bali', '1', null, NOW(), null, NOW()),
  ('Nusa Tenggara Barat', '1', null, NOW(), null, NOW()),
  ('Nusa Tenggara Timur', '1', null, NOW(), null, NOW()),
  ('Gorontalo', '1', null, NOW(), null, NOW()),
  ('Sulawesi Barat', '1', null, NOW(), null, NOW()),
  ('Sulawesi Tengah', '1', null, NOW(), null, NOW()),
  ('Sulawesi Utara', '1', null, NOW(), null, NOW()),
  ('Sulawesi Tenggara', '1', null, NOW(), null, NOW()),
  ('Sulawesi Selatan', '1', null, NOW(), null, NOW()),
  ('Maluku Utara', '1', null, NOW(), null, NOW()),
  ('Maluku', '1', null, NOW(), null, NOW()),
  ('Papua Barat', '1', null, NOW(), null, NOW()),
  ('Papua', '1', null, NOW(), null, NOW()),
  ('Papua Tengah', '1', null, NOW(), null, NOW()),
  ('Papua Pegunungan', '1', null, NOW(), null, NOW()),
  ('Papua Selatan', '1', null, NOW(), null, NOW()),
  ('Papua Barat Daya', '1', null, NOW(), null, NOW());

-- Seed Data Kota di DKI Jakarta, pastikan province_id nya !!
INSERT INTO districts (province_id, name, status, created_by, created_at, updated_by, updated_at) VALUES
(17, 'Jakarta Pusat', '1', null, NOW(), null, NOW()),
(17, 'Jakarta Utara', '1', null, NOW(), null, NOW()),
(17, 'Jakarta Barat', '1', null, NOW(), null, NOW()),
(17, 'Jakarta Selatan', '1', null, NOW(), null, NOW()),
(17, 'Jakarta Timur', '1', null, NOW(), null, NOW()),
(17, 'Kepulauan Seribu', '1', null, NOW(), null, NOW());

-- Seed Data Kecamatan di Jakarta Selatan, pastikan province_id dan district_id nya !!
INSERT INTO sub_districts (province_id, district_id, name, status, created_by, created_at, updated_by, updated_at) VALUES
(17, 4, 'Tebet', '1', null, NOW(), null, NOW()),
(17, 4, 'Kebayoran Baru', '1', null, NOW(), null, NOW());

-- Seed Data Kelurahan di Jakarta Selatan, pastikan province_id, district_id dan sub_districts nya !!
INSERT INTO neighborhoods (
  province_id, district_id, sub_district_id,
  name, status, created_by, created_at, updated_by, updated_at
) VALUES
(17, 4, 2, 'Kebon Baru', '1', null, NOW(), null, NOW()),
(17, 4, 2, 'Manggarai Selatan', '1', null, NOW(), null, NOW());

INSERT INTO airlines (name, display_name, status, created_by, created_at, updated_by, updated_at) VALUES
    ('Garuda Indonesia', 'Garuda', '1', null, NOW(), null, NOW()),
    ('Lion Air', 'Lion', '1', null, NOW(), null, NOW()),
    ('Citilink', 'Citilink', '1', null, NOW(), null, NOW()),
    ('Batik Air', 'Batik', '1', null, NOW(), null, NOW());

INSERT INTO airport (code, name, status, created_by, created_at, updated_by, updated_at) VALUES
    -- 🇮🇩 Indonesia
    ('CGK', 'Soekarno Hatta', '1', null, NOW(), null, NOW()),
    ('SUB', 'Juanda', '1', null, NOW(), null, NOW()),
    -- 🇸🇦 Mekkah (terdekat: Jeddah)
    ('JED', 'King Abdulaziz', '1', null, NOW(), null, NOW()),
    ('TIF', 'Taif Regional', '1', null, NOW(), null, NOW()),
    -- 🇸🇦 Madinah
    ('MED', 'Prince Mohammad bin Abdulaziz', '1', null, NOW(), null, NOW()),
    ('YNB', 'Yanbu Airport', '1', null, NOW(), null, NOW()),
    -- 🇹🇷 Turki
    ('IST', 'Istanbul Airport', '1', null, NOW(), null, NOW()),
    ('SAW', 'Sabiha Gokcen', '1', null, NOW(), null, NOW());

INSERT INTO menus (id, name, "desc")
VALUES
('DASH', 'Dashboard', 'Dashboard'),
('RGST', 'Pendaftaran', 'Menu pendaftaran utama'),
('RGST|UMRH', 'Pendaftaran Umroh', 'Submenu pendaftaran untuk umroh'),
('RGST|UMRH|LIST', 'List Umroh', 'Melihat daftar pendaftaran umroh'),
('RGST|UMRH|ADD', 'Tambah Umroh', 'Menambahkan pendaftaran umroh'),
('RGST|UMRH|EDIT', 'Edit Umroh', 'Mengedit data pendaftaran umroh'),
('RGST|UMRH|DEL', 'Hapus Umroh', 'Menghapus pendaftaran umroh'),
('RGST|UMRH|ADDJ', 'Tambah Umroh via Kode', 'Menambahkan umroh berdasarkan kode'),

('USRM', 'User Management', 'Manajemen pengguna'),
('USRM|STAF', 'Staff', 'Manajemen data staff'),
('USRM|STAF|LIST', 'List Staff', 'Melihat daftar staff'),
('USRM|STAF|ADD', 'Tambah Staff', 'Menambahkan staff baru'),
('USRM|STAF|EDIT', 'Edit Staff', 'Mengedit data staff'),
('USRM|STAF|DEL', 'Hapus Staff', 'Menghapus data staff'),

('USRM|AGNT', 'Agent', 'Manajemen data agen'),
('USRM|AGNT|LIST', 'List Agent', 'Melihat daftar agent'),
('USRM|AGNT|ADD', 'Tambah Agent', 'Menambahkan agent baru'),
('USRM|AGNT|EDIT', 'Edit Agent', 'Mengedit data agent'),
('USRM|AGNT|DEL', 'Hapus Agent', 'Menghapus agent'),

('USRM|ROLE', 'Role', 'Manajemen role'),
('USRM|ROLE|LIST', 'List Role', 'Melihat daftar role'),
('USRM|ROLE|ADD', 'Tambah Role', 'Menambahkan role baru'),
('USRM|ROLE|EDIT', 'Edit Role', 'Mengedit role'),
('USRM|ROLE|DEL', 'Hapus Role', 'Menghapus role'),
('USRM|ROLE|MENU', 'Kelola Menu Role', 'Menetapkan atau menghapus akses menu pada role'),

('DTMS', 'Data Master', 'Menu data master utama'),
('DTMS|PCKG', 'Package', 'Data paket'),
('DTMS|PCKG|LIST', 'List Package', 'Melihat daftar paket'),
('DTMS|PCKG|ADD', 'Tambah Package', 'Menambahkan paket baru'),
('DTMS|PCKG|EDIT', 'Edit Package', 'Mengedit paket'),
('DTMS|PCKG|DEL', 'Hapus Package', 'Menghapus paket'),

('DTMS|TCKT', 'Ticket', 'Data tiket'),
('DTMS|TCKT|LIST', 'List Ticket', 'Melihat daftar tiket'),
('DTMS|TCKT|ADD', 'Tambah Ticket', 'Menambahkan tiket baru'),
('DTMS|TCKT|EDIT', 'Edit Ticket', 'Mengedit tiket'),
('DTMS|TCKT|DEL', 'Hapus Ticket', 'Menghapus tiket'),

('DTMS|BANK', 'Bank', 'Data bank'),
('DTMS|BANK|LIST', 'List Bank', 'Melihat daftar bank'),
('DTMS|BANK|ADD', 'Tambah Bank', 'Menambahkan bank baru'),
('DTMS|BANK|EDIT', 'Edit Bank', 'Mengedit bank'),
('DTMS|BANK|DEL', 'Hapus Bank', 'Menghapus bank'),

('DTMS|ARPT', 'Airport', 'Data bandara'),
('DTMS|ARPT|LIST', 'List Airport', 'Melihat daftar bandara'),
('DTMS|ARPT|ADD', 'Tambah Airport', 'Menambahkan bandara'),
('DTMS|ARPT|EDIT', 'Edit Airport', 'Mengedit bandara'),
('DTMS|ARPT|DEL', 'Hapus Airport', 'Menghapus bandara'),

('DTMS|ARLN', 'Airline', 'Data maskapai'),
('DTMS|ARLN|LIST', 'List Airline', 'Melihat daftar maskapai'),
('DTMS|ARLN|ADD', 'Tambah Airline', 'Menambahkan maskapai'),
('DTMS|ARLN|EDIT', 'Edit Airline', 'Mengedit maskapai'),
('DTMS|ARLN|DEL', 'Hapus Airline', 'Menghapus maskapai');
