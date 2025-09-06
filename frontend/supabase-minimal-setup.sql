-- NUAM Tax Container System - Production Setup
-- Execute this SQL in your Supabase SQL Editor for production environment

-- Only create essential system configuration (no sample data)

-- Insert essential system configuration only
INSERT INTO "system_config" (id, key, value, description) VALUES
('config-utm-cl', 'utm_chile_2024', '64649', 'Valor UTM Chile para 2024'),
('config-uit-pe', 'uit_peru_2024', '5150', 'Valor UIT Perú para 2024'),
('config-uvt-co', 'uvt_colombia_2024', '42412', 'Valor UVT Colombia para 2024'),
('config-uma-mx', 'uma_mexico_2024', '108.57', 'Valor UMA México para 2024'),
('config-uf-ar', 'uf_argentina_2024', '25000', 'Valor UF Argentina para 2024'),
('config-ufir-br', 'ufir_brasil_2024', '7239', 'Valor UFIR Brasil para 2024'),
('config-ui-uy', 'ui_uruguay_2024', '5650', 'Valor UI Uruguay para 2024'),
('config-jsm-py', 'jsm_paraguay_2024', '4200', 'Valor JSM Paraguay para 2024'),
('config-ufv-bo', 'ufv_bolivia_2024', '23600', 'Valor UFV Bolivia para 2024'),
('config-sbu-ec', 'sbu_ecuador_2024', '760', 'Valor SBU Ecuador para 2024'),
('config-pt-ve', 'pt_venezuela_2024', '0.5', 'Valor PT Venezuela para 2024'),
('config-tb-pa', 'tb_panama_2024', '0.05', 'Valor TB Panamá para 2024'),
('config-sb-cr', 'sb_costarica_2024', '946', 'Valor SB Costa Rica para 2024'),
('config-sm-gt', 'sm_guatemala_2024', '300', 'Valor SM Guatemala para 2024'),
('config-usd-us', 'usd_usa_2024', '1', 'Valor base USD Estados Unidos para 2024'),
('config-file-size', 'max_file_size_mb', '50', 'Tamaño máximo de archivo en MB'),
('config-admin-email', 'admin_notification_email', 'admin@nuam.com', 'Email para notificaciones administrativas');

-- Create a default admin user (the first user who will set up the system)
-- This user can create other users through the UI
INSERT INTO "users" (id, email, name, role) VALUES
('admin-setup-001', 'admin@nuam.com', 'Administrador Sistema', 'ADMIN');