CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE recurrence_type AS ENUM (
  'none', 'daily', 'weekly', 'biweekly', 'monthly', 'bimonthly', 
  'quarterly', 'semiannual', 'annual', 'custom'
);

CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE obligation_status AS ENUM ('active', 'completed', 'archived', 'deferred');
CREATE TYPE obligation_source AS ENUM ('manual', 'onboarding', 'ai', 'template', 'official');
CREATE TYPE deadline_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE worry_status AS ENUM ('inbox', 'converted', 'archived');
CREATE TYPE notification_type AS ENUM ('reminder', 'deadline_alert', 'system', 'review');
CREATE TYPE reminder_status AS ENUM ('pending', 'sent', 'dismissed');
CREATE TYPE consent_type AS ENUM ('ai_processing', 'privacy_policy', 'terms_of_service');
CREATE TYPE user_role_type AS ENUM ('user', 'admin');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'trial', 'expired');

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  locale TEXT DEFAULT 'pt-BR',
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  theme TEXT DEFAULT 'system',
  onboarding_completed BOOLEAN DEFAULT false,
  weekly_review_day INT DEFAULT 5 CHECK (weekly_review_day BETWEEN 0 AND 6),
  worry_time_hour TIME DEFAULT '18:00',
  ai_consent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Planos
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  monthly_price_brl INT,
  max_active_obligations INT NOT NULL,
  max_ai_analyses_per_month INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assinaturas
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES plans(id),
  status subscription_status DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT DEFAULT 'folder',
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modelos de obrigações
CREATE TABLE obligation_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category_slug TEXT REFERENCES categories(slug),
  description TEXT,
  default_recurrence recurrence_type DEFAULT 'none',
  default_reminder_offsets INT[] DEFAULT ARRAY[7, 1, 0],
  requires_official_deadline BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  checklist_defaults TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Obrigações principais
CREATE TABLE obligations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES obligation_templates(id),
  title TEXT NOT NULL,
  description TEXT,
  category_slug TEXT REFERENCES categories(slug),
  due_date DATE,
  recurrence_type recurrence_type DEFAULT 'none',
  recurrence_rule JSONB,
  priority priority_level DEFAULT 'medium',
  status obligation_status DEFAULT 'active',
  next_step TEXT,
  source_type obligation_source DEFAULT 'manual',
  official_deadline_id UUID,
  expected_confirmation_required BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_obligations_user_id ON obligations(user_id);
CREATE INDEX idx_obligations_due_date ON obligations(due_date);
CREATE INDEX idx_obligations_status ON obligations(status);
CREATE INDEX idx_obligations_category ON obligations(category_slug);

-- Checklist items
CREATE TABLE obligation_checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obligation_id UUID REFERENCES obligations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lembretes
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  obligation_id UUID REFERENCES obligations(id) ON DELETE CASCADE NOT NULL,
  remind_at TIMESTAMPTZ NOT NULL,
  reminder_type TEXT DEFAULT 'deadline',
  status reminder_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reminders_user_remind ON reminders(user_id, remind_at);
CREATE INDEX idx_reminders_status ON reminders(status);

-- Notificações
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  type notification_type DEFAULT 'reminder',
  related_obligation_id UUID REFERENCES obligations(id) ON DELETE SET NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read_at IS NULL;

-- Worry entries
CREATE TABLE worry_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  status worry_status DEFAULT 'inbox',
  converted_obligation_id UUID REFERENCES obligations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

-- Weekly reviews
CREATE TABLE weekly_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- Daily priorities
CREATE TABLE daily_priorities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  obligation_id UUID REFERENCES obligations(id) ON DELETE CASCADE,
  priority_date DATE NOT NULL,
  position INT CHECK (position BETWEEN 1 AND 3),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_daily_priorities_user_date ON daily_priorities(user_id, priority_date);

-- Fontes oficiais
CREATE TABLE official_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  base_url TEXT,
  organization TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prazos oficiais
CREATE TABLE official_deadlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  reference_year INT,
  category_slug TEXT REFERENCES categories(slug),
  due_date DATE NOT NULL,
  official_source_id UUID REFERENCES official_sources(id),
  source_url TEXT,
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  verified_by UUID REFERENCES auth.users(id),
  status deadline_status DEFAULT 'draft',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_official_deadlines_year ON official_deadlines(reference_year);
CREATE INDEX idx_official_deadlines_status ON official_deadlines(status);

-- Auditoria de prazos oficiais
CREATE TABLE official_deadline_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  official_deadline_id UUID REFERENCES official_deadlines(id) ON DELETE CASCADE,
  admin_user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  before_data JSONB,
  after_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registro de análises de IA
CREATE TABLE ai_analysis_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  input_redacted TEXT,
  status TEXT DEFAULT 'pending',
  model_used TEXT,
  tokens_input INT,
  tokens_output INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consentimentos
CREATE TABLE user_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  consent_type consent_type NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0',
  accepted BOOLEAN DEFAULT true,
  accepted_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  UNIQUE(user_id, consent_type, version)
);

-- Roles
CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role_type DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, role)
);

-- Função de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_obligations_updated_at BEFORE UPDATE ON obligations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_official_sources_updated_at BEFORE UPDATE ON official_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_official_deadlines_updated_at BEFORE UPDATE ON official_deadlines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: criar profile ao criar usuário
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, locale)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)), 'pt-BR');
  INSERT INTO user_consents (user_id, consent_type, version, accepted)
  VALUES (NEW.id, 'privacy_policy', '1.0', true),
         (NEW.id, 'terms_of_service', '1.0', true);
  INSERT INTO subscriptions (user_id, plan_id)
  SELECT NEW.id, p.id FROM plans p WHERE p.code = 'free';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE obligation_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE worry_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE official_deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE official_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE official_deadline_audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own obligations" ON obligations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own obligations" ON obligations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own obligations" ON obligations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own obligations" ON obligations FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own checklist items" ON obligation_checklist_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own reminders" ON reminders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own worry entries" ON worry_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own reviews" ON weekly_reviews FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own priorities" ON daily_priorities FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own consents" ON user_consents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own consents" ON user_consents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own AI requests" ON ai_analysis_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create AI requests" ON ai_analysis_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own roles" ON user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published deadlines" ON official_deadlines FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage deadlines" ON official_deadlines FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Anyone can view active sources" ON official_sources FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage sources" ON official_sources FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can view audit logs" ON official_deadline_audit_logs FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Seeds
INSERT INTO plans (code, name, monthly_price_brl, max_active_obligations, max_ai_analyses_per_month) VALUES
  ('free', 'Gratuito', 0, 5, 3),
  ('essential', 'Essencial', 2490, 999, 50),
  ('complete', 'Completo', 3990, 9999, 200);

INSERT INTO categories (name, slug, icon, is_system) VALUES
  ('Documentos', 'documentos', 'file-text', true),
  ('Impostos', 'impostos', 'calculator', true),
  ('Financeiro', 'financeiro', 'wallet', true),
  ('Trabalho', 'trabalho', 'briefcase', true),
  ('Casa', 'casa', 'home', true),
  ('Família', 'familia', 'heart', true),
  ('Saúde Administrativa', 'saude_administrativa', 'stethoscope', true),
  ('Assinaturas', 'assinaturas', 'refresh-cw', true),
  ('Outros', 'outros', 'folder', true);

INSERT INTO obligation_templates (title, category_slug, description, default_recurrence, default_reminder_offsets, requires_official_deadline, checklist_defaults) VALUES
  ('Preparar declaração do Imposto de Renda', 'impostos', 'Declaração anual do IRPF', 'annual', ARRAY[90, 30, 7, 1], true, ARRAY['Verificar necessidade de declarar', 'Separar informes de rendimentos', 'Decidir se fará sozinho ou com contador', 'Confirmar envio da declaração']),
  ('Verificar vencimento da CNH', 'documentos', 'Acompanhar validade da CNH', 'none', ARRAY[90, 30, 7], false, ARRAY['Localizar data de validade na CNH', 'Agendar renovação se necessário']),
  ('Pagar IPVA', 'financeiro', 'Imposto sobre Propriedade de Veículos Automotores', 'annual', ARRAY[30, 7, 1], false, ARRAY[]::TEXT[]),
  ('Licenciamento do veículo', 'documentos', 'Licenciamento anual obrigatório', 'annual', ARRAY[30, 7], false, ARRAY[]::TEXT[]),
  ('Pagar aluguel', 'casa', 'Pagamento mensal do aluguel', 'monthly', ARRAY[3, 1], false, ARRAY[]::TEXT[]),
  ('Pagar fatura do cartão', 'financeiro', 'Fatura mensal do cartão de crédito', 'monthly', ARRAY[3, 1], false, ARRAY[]::TEXT[]),
  ('Conferir recebimento do VR', 'trabalho', 'Vale-refeição mensal', 'monthly', ARRAY[0], false, ARRAY['Verificar se o VR foi depositado']),
  ('Conferir recebimento do VT', 'trabalho', 'Vale-transporte mensal', 'monthly', ARRAY[0], false, ARRAY['Verificar se o VT foi depositado']),
  ('Conferir salário', 'trabalho', 'Salário mensal', 'monthly', ARRAY[0], false, ARRAY['Confirmar depósito do salário']),
  ('Consulta ou retorno agendado', 'saude_administrativa', 'Compromisso administrativo de saúde', 'none', ARRAY[7, 1], false, ARRAY['Confirmar horário e local']),
  ('Renovação de assinatura', 'assinaturas', 'Assinatura recorrente', 'monthly', ARRAY[7, 1], false, ARRAY['Avaliar se deseja manter a assinatura']);

INSERT INTO official_sources (name, base_url, organization) VALUES
  ('Receita Federal do Brasil', 'https://www.gov.br/receitafederal', 'Governo Federal'),
  ('DETRAN', 'https://www.gov.br/infraestrutura', 'Governo Federal/Estadual'),
