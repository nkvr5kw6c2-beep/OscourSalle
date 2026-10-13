# Configurer Supabase pour IRON LOG

Ce dépôt héberge l'interface GitHub Pages. Supabase servira à l'authentification et à la synchronisation des données personnelles.

## 1. Créer le projet

1. Crée un projet sur https://supabase.com/dashboard.
2. Choisis un nom comme `iron-log` et conserve précieusement le mot de passe de base de données.
3. Dans **SQL Editor**, ouvre une nouvelle requête, copie le contenu de `supabase/schema.sql`, puis exécute-le.
4. Dans **Project Settings → API** (ou **Connect** selon l'interface), récupère l'URL du projet et la clé publique **anon/publishable**.

Ne partage jamais la clé `service_role` ou une clé secrète. La clé publique anon/publishable peut être utilisée dans une application web uniquement avec les politiques RLS actives.

## 2. Informations nécessaires pour connecter l'application

- Project URL, au format `https://....supabase.co`
- Clé publique anon/publishable

La connexion réelle à Supabase n'est pas active tant que ces paramètres ne sont pas configurés dans l'application.

## 3. Sécurité et données

La table `public.user_app_state` conserve l'état de l'application (séances, brouillons, poids). Les politiques Row Level Security (RLS) limitent chaque compte à sa propre ligne. Le code client ne doit jamais utiliser la clé `service_role`.

Avant d'activer la synchronisation, les données locales doivent être fusionnées ou importées après connexion et vérifiées. Ne supprime pas les données locales pendant la migration. Le mode hors ligne doit conserver une copie locale et synchroniser après reconnexion.
