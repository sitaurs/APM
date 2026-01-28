-- APM Portal Schema Update
-- Phase 1: Database Schema Update

-- 1. Register new fields for apm_prestasi
INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_prestasi', 'status', NULL, 'select-dropdown', 'labels', 100)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_prestasi', 'reviewer_notes', NULL, 'input-multiline', 'formatted-value', 101)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_prestasi', 'verified_at', NULL, 'datetime', 'datetime', 102)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_prestasi', 'verified_by', NULL, 'input', 'formatted-value', 103)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_prestasi', 'submitter_name', NULL, 'input', 'formatted-value', 104)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_prestasi', 'submitter_nim', NULL, 'input', 'formatted-value', 105)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_prestasi', 'submitter_email', NULL, 'input', 'formatted-value', 106)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_prestasi', 'is_deleted', NULL, 'boolean', 'boolean', 107)
ON CONFLICT (collection, field) DO NOTHING;

-- 2. Register new fields for apm_expo
INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo', 'registration_open', NULL, 'boolean', 'boolean', 100)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo', 'registration_deadline', NULL, 'datetime', 'datetime', 101)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo', 'max_participants', NULL, 'input', 'formatted-value', 102)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo', 'is_deleted', NULL, 'boolean', 'boolean', 103)
ON CONFLICT (collection, field) DO NOTHING;

-- 3. Register new field for apm_lomba
INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_lomba', 'is_deleted', NULL, 'boolean', 'boolean', 100)
ON CONFLICT (collection, field) DO NOTHING;

-- 4. Register apm_expo_registrations collection
INSERT INTO directus_collections (collection, singleton, note, sort_field, accountability)
VALUES 
('apm_expo_registrations', false, 'Pendaftaran peserta expo', NULL, 'all')
ON CONFLICT (collection) DO NOTHING;

-- 5. Register fields for apm_expo_registrations
INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo_registrations', 'id', NULL, 'input', 'formatted-value', 1)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo_registrations', 'expo_id', NULL, 'select-dropdown-m2o', 'related-values', 2)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo_registrations', 'nama_project', NULL, 'input', 'formatted-value', 3)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo_registrations', 'deskripsi_project', NULL, 'input-multiline', 'formatted-value', 4)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo_registrations', 'link_demo', NULL, 'input', 'formatted-value', 5)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo_registrations', 'ketua_nama', NULL, 'input', 'formatted-value', 6)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo_registrations', 'ketua_nim', NULL, 'input', 'formatted-value', 7)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo_registrations', 'ketua_email', NULL, 'input', 'formatted-value', 8)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo_registrations', 'ketua_phone', NULL, 'input', 'formatted-value', 9)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo_registrations', 'anggota_1_nama', NULL, 'input', 'formatted-value', 10)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo_registrations', 'anggota_1_nim', NULL, 'input', 'formatted-value', 11)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo_registrations', 'anggota_2_nama', NULL, 'input', 'formatted-value', 12)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo_registrations', 'anggota_2_nim', NULL, 'input', 'formatted-value', 13)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo_registrations', 'anggota_3_nama', NULL, 'input', 'formatted-value', 14)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo_registrations', 'anggota_3_nim', NULL, 'input', 'formatted-value', 15)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo_registrations', 'status', NULL, 'select-dropdown', 'labels', 16)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo_registrations', 'reviewer_notes', NULL, 'input-multiline', 'formatted-value', 17)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo_registrations', 'is_deleted', NULL, 'boolean', 'boolean', 18)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo_registrations', 'date_created', 'date-created', 'datetime', 'datetime', 19)
ON CONFLICT (collection, field) DO NOTHING;

INSERT INTO directus_fields (collection, field, special, interface, display, sort)
VALUES 
('apm_expo_registrations', 'date_updated', 'date-updated', 'datetime', 'datetime', 20)
ON CONFLICT (collection, field) DO NOTHING;

-- 6. Setup relation for expo_id
INSERT INTO directus_relations (many_collection, many_field, one_collection, one_field)
VALUES 
('apm_expo_registrations', 'expo_id', 'apm_expo', 'registrations')
ON CONFLICT DO NOTHING;
