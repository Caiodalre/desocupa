-- Permite que usuários existentes sem perfil criem o próprio registro em Configurações.
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);
