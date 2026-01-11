-- ============================================
-- SAMPLE DATA FOR BALLTOGETHER DATABASE
-- ============================================

-- 1. SPORTS
INSERT INTO sports (name) VALUES 
('Football'),
('Basketball'),
('Tennis'),
('Volleyball'),
('Badminton'),
('Handball');

-- 2. USERS (password: password123 - BCrypt hash)
INSERT INTO users (full_name, email, password_hash, role) VALUES 
('Admin User', 'admin@balltogether.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqJk0Qs6tHxwqfOT0CxvxQzv3q3Ey', 'Admin'),
('Ion Popescu', 'ion.popescu@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqJk0Qs6tHxwqfOT0CxvxQzv3q3Ey', 'User'),
('Maria Ionescu', 'maria.ionescu@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqJk0Qs6tHxwqfOT0CxvxQzv3q3Ey', 'User'),
('Andrei Dumitrescu', 'andrei.d@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqJk0Qs6tHxwqfOT0CxvxQzv3q3Ey', 'User'),
('Elena Vasilescu', 'elena.v@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqJk0Qs6tHxwqfOT0CxvxQzv3q3Ey', 'User'),
('Mihai Georgescu', 'mihai.g@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqJk0Qs6tHxwqfOT0CxvxQzv3q3Ey', 'Referee'),
('Alexandra Popa', 'alexandra.p@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqJk0Qs6tHxwqfOT0CxvxQzv3q3Ey', 'Referee'),
('Cristian Radu', 'cristian.r@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqJk0Qs6tHxwqfOT0CxvxQzv3q3Ey', 'User'),
('Ana Stanescu', 'ana.s@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqJk0Qs6tHxwqfOT0CxvxQzv3q3Ey', 'User'),
('Vlad Muresan', 'vlad.m@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqJk0Qs6tHxwqfOT0CxvxQzv3q3Ey', 'User');

-- 3. LOCATIONS
INSERT INTO locations (name, address, price_per_hour, capacity, latitude, longitude, image_url) VALUES 
('Arena Sportiva Titan', 'Bulevardul Nicolae Grigorescu 35, București', 150.00, 14, 44.4268, 26.1625, 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800'),
('Terenuri Floreasca', 'Strada Barbu Văcărescu 164, București', 200.00, 22, 44.4629, 26.1088, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800'),
('Sport Park Pipera', 'Strada Pipera 42, București', 180.00, 16, 44.4912, 26.1182, 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800'),
('Baza Sportiva Tineretului', 'Bulevardul Tineretului 1, București', 120.00, 20, 44.4089, 26.1050, 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800'),
('Arena Herăstrău', 'Șoseaua Nordului 7, București', 250.00, 18, 44.4768, 26.0784, 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800'),
('Champions Arena', 'Strada Fabricii 46, Cluj-Napoca', 140.00, 12, 46.7712, 23.6236, 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800'),
('Sport Zone Timișoara', 'Calea Aradului 12, Timișoara', 130.00, 14, 45.7489, 21.2087, 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800'),
('Arena Iași', 'Bulevardul Independenței 50, Iași', 110.00, 16, 47.1585, 27.6014, 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800');

-- 4. LOCATION_SPORTS (many-to-many relationship)
INSERT INTO location_sports (location_id, sport_id) VALUES 
(1, 1), (1, 4),
(2, 1), (2, 2), (2, 4),
(3, 1), (3, 2),
(4, 1), (4, 3), (4, 5),
(5, 1), (5, 2), (5, 6),
(6, 1), (6, 4),
(7, 1), (7, 2), (7, 3),
(8, 1), (8, 5), (8, 6);

-- 5. REFEREES (linked to users with Referee role - user_id 6 and 7)
INSERT INTO referees (user_id, bio, rate_per_hour, image_url) VALUES 
(6, 'Arbitru FIFA certificat cu 10 ani de experiență în Liga 1. Specializat în meciuri de fotbal și handbal.', 75.00, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'),
(7, 'Fostă jucătoare profesionistă de baschet, acum arbitru național. Experiență în competiții universitare și amatori.', 65.00, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400');

-- 6. REFEREE_SPORTS (many-to-many relationship)
INSERT INTO referee_sports (referee_id, sport_id) VALUES 
(1, 1), (1, 6),
(2, 2), (2, 4);

-- 7. EVENTS (some future events)
INSERT INTO events (host_user_id, location_id, sport_id, start_time, end_time, status, referee_id) VALUES 
(2, 1, 1, '2026-01-15 18:00:00', '2026-01-15 20:00:00', 'Open', 1),
(3, 2, 2, '2026-01-16 19:00:00', '2026-01-16 21:00:00', 'Open', 2),
(4, 3, 1, '2026-01-17 17:00:00', '2026-01-17 19:00:00', 'Open', NULL),
(5, 4, 3, '2026-01-18 10:00:00', '2026-01-18 12:00:00', 'Open', NULL),
(8, 5, 1, '2026-01-20 20:00:00', '2026-01-20 22:00:00', 'Open', 1),
(9, 1, 4, '2026-01-22 18:00:00', '2026-01-22 20:00:00', 'Open', 2),
(2, 6, 1, '2026-01-10 18:00:00', '2026-01-10 20:00:00', 'Completed', 1),
(3, 7, 2, '2026-01-08 19:00:00', '2026-01-08 21:00:00', 'Completed', 2);

-- 8. EVENT_PARTICIPANTS (users joining events)
INSERT INTO event_participants (event_id, user_id) VALUES 
(1, 2), (1, 3), (1, 4), (1, 8), (1, 9), (1, 10),
(2, 3), (2, 5), (2, 8), (2, 9),
(3, 4), (3, 2), (3, 5),
(4, 5), (4, 3),
(5, 8), (5, 2), (5, 4), (5, 9), (5, 10),
(6, 9), (6, 3), (6, 5),
(7, 2), (7, 3), (7, 4), (7, 5), (7, 8), (7, 9), (7, 10),
(8, 3), (8, 5), (8, 8), (8, 9);

-- 9. BOOKINGS
INSERT INTO bookings (event_id, payer_user_id, total_amount, payment_status, created_at) VALUES 
(7, 2, 300.00, 'Paid', '2026-01-09 10:00:00'),
(8, 3, 260.00, 'Paid', '2026-01-07 15:30:00'),
(1, 2, 375.00, 'Pending', '2026-01-11 09:00:00'),
(2, 3, 530.00, 'Paid', '2026-01-11 14:00:00');
