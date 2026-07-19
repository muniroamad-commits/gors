-- ============================================================
-- Migração necessária para a versão estática do GORS
-- ============================================================
-- A versão anterior (React + TanStack Start) tinha um servidor que usava
-- a chave privilegiada (service role) do Supabase para: (1) listar todos os
-- utilizadores com o respectivo email, e (2) atribuir papéis. Um site
-- estático não tem servidor nenhum — tudo corre no browser com a chave
-- pública (anon), por isso essas duas operações têm de passar a depender
-- só das políticas RLS e de uma coluna extra.
--
-- Como aplicar: copie todo este ficheiro e cole no Supabase Dashboard →
-- SQL Editor → Run. Execute isto UMA VEZ antes de usar a versão estática.
-- (Se mantiver também o projecto React/TanStack Start noutra pasta com o
-- seu próprio histórico de migrações Supabase, pode copiar este ficheiro
-- para lá como mais uma migração, para ficar versionado — é opcional.)
-- ============================================================

-- 1. Guardar o email em profiles (só existia em auth.users, inacessível
--    ao browser sem a chave privilegiada).
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Preencher o email para todas as contas já existentes.
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND (p.email IS NULL OR p.email <> u.email);

-- 3. A partir de agora, guardar o email automaticamente ao criar a conta.
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, organization, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'organization', NEW.email)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Administradores precisam de ver o perfil (nome/organização/email) de
--    toda a gente — na página "Utilizadores" e para mostrar quem submeteu
--    cada valor em "Aprovações". Antes isto era feito com a Auth Admin API
--    (só corre num servidor); agora é uma política RLS directa.
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Nota: atribuir/alterar papéis (Administrador/Provincial/Distrital) e
-- aprovar, rejeitar, editar ou resetar valores já funcionam directamente
-- pelas políticas RLS existentes na tabela user_roles / indicator_actuals
-- (um admin já tem permissão total nessas tabelas) — não foi preciso
-- nenhuma alteração adicional para isso.
