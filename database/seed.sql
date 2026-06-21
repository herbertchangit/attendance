INSERT INTO roles (id, code, name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'SYSTEM_ADMIN', 'System Administrator'),
  ('00000000-0000-0000-0000-000000000002', 'EVENT_ORGANIZER', 'Event Organizer'),
  ('00000000-0000-0000-0000-000000000003', 'ATTENDEE', 'Attendee');

INSERT INTO users (id, role_id, full_name, email, mobile_number, password_hash) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Nadia Chong', 'admin@eventflow.test', '+60 12-100 0001', '$2a$10$replace-with-real-hash'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Daniel Ho', 'organizer@eventflow.test', '+60 12-100 0002', '$2a$10$replace-with-real-hash'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Hannah Lee', 'attendee@eventflow.test', '+60 12-100 0003', '$2a$10$replace-with-real-hash');

INSERT INTO venues (id, venue_name, address, city, state, country, postal_code, contact_person, contact_number, email, capacity, status, created_by) VALUES
  ('20000000-0000-0000-0000-000000000001', 'Grand Meridian Hall', '12 Persiaran Sentral', 'Kuala Lumpur', 'WP Kuala Lumpur', 'Malaysia', '50470', 'Aisha Rahman', '+60 12-345 6601', 'aisha@meridian.example', 1200, 'Active', '10000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000002', 'Nexus Convention Centre', '88 Jalan Inovasi', 'Petaling Jaya', 'Selangor', 'Malaysia', '47810', 'Marcus Lim', '+60 16-220 4490', 'events@nexus.example', 2500, 'Active', '10000000-0000-0000-0000-000000000001');

INSERT INTO events (id, event_name, description, category, venue_id, organizer_id, banner_url, start_date, end_date, start_time, end_time, registration_deadline, capacity, status) VALUES
  ('30000000-0000-0000-0000-000000000001', 'Malaysia Digital Leadership Summit', 'Executive technology summit for enterprise leaders.', 'Technology', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87', '2026-07-08', '2026-07-09', '09:00', '17:00', '2026-07-01 23:59:59+08', 900, 'Open');

INSERT INTO sessions (id, event_id, session_name, speaker, description, start_time, end_time, room) VALUES
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Keynote: AI Operating Models', 'Dr. Farah Tan', 'How leadership teams can scale AI responsibly.', '2026-07-08 09:30:00+08', '2026-07-08 10:30:00+08', 'Main Hall');

INSERT INTO attendees (id, full_name, email, mobile, company_or_school) VALUES
  ('50000000-0000-0000-0000-000000000001', 'Hannah Lee', 'hannah.lee@example.com', '+60 12-456 8890', 'Apex University'),
  ('50000000-0000-0000-0000-000000000002', 'Raymond Ng', 'raymond.ng@example.com', '+60 13-890 1120', 'BrightSoft');

INSERT INTO registrations (id, registration_id, event_id, attendee_id, qr_token) VALUES
  ('60000000-0000-0000-0000-000000000001', 'REG-2026-0001', '30000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'ATTEND|REG-2026-0001|evt_001'),
  ('60000000-0000-0000-0000-000000000002', 'REG-2026-0002', '30000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000002', 'ATTEND|REG-2026-0002|evt_001');

INSERT INTO attendance_records (registration_id, session_id, status, checked_in_at, method, recorded_by, ip_address) VALUES
  ('60000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Present', '2026-07-08 09:08:00+08', 'QR', '10000000-0000-0000-0000-000000000002', '10.10.2.11');

INSERT INTO certificates (registration_id, certificate_number, participant_name, event_name, attendance_date, verification_qr_token) VALUES
  ('60000000-0000-0000-0000-000000000001', 'CERT-2026-0001', 'Hannah Lee', 'Malaysia Digital Leadership Summit', '2026-07-08', 'VERIFY|CERT-2026-0001|REG-2026-0001');
