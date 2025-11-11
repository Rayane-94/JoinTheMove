# JoinTheMove

JoinTheMove est une application de gestion d'entraînements sportifs moderne, développée avec Angular 19 et stylisée avec Tailwind CSS et Material Design.

## 🚀 Fonctionnalités

### 👤 Gestion des Utilisateurs
- **Inscription et Connexion** : Système d'authentification complet
- **Profil Utilisateur** : Affichage des informations personnelles
- **Sécurité** : Protection des routes avec guards

### 🏋️ Gestion des Exercices
- **CRUD Exercices** : Créer, voir, modifier et supprimer des exercices
- **Détails Complets** : Nom, description, séries, répétitions, temps de repos
- **Dashboard Exercices** : Interface avec statistiques
- **Recherche et Filtres** : Trouvez rapidement vos exercices

### 📋 Gestion des Séances
- **Création de Séances** : Composez vos entraînements avec des exercices existants
- **Intégration Exercices** : Ajout direct d'exercices dans les séances
- **Dashboard Séances** : Vue d'ensemble
- **Popup Détaillé** : Visualisation complète avec statistiques
- **Actions Rapides** : Marquer comme réalisé, modifier, supprimer

### 📊 Suivi et Statistiques
- **Historique d'Entraînement** : Suivi des séances réalisées
- **Métriques Avancées** : Durée, volume total, progression
- **Feedback Personnalisé** : Difficulté et temps réalisé

## 🛠️ Installation

### Prérequis
- Node.js (version 18+)
- npm ou yarn
- Angular CLI

### Initialiser le projet

```bash
cd JoinTheMove
npm i
```

### Lancer le backend :

```bash
cd backend
npx json-server db.json
```

### Lancer le frontend :

```bash
npm run start
```

L'application sera accessible sur `http://localhost:4200/`

## 🏗️ Architecture Technique

### Stack Technologique
- **Frontend** : Angular 19 + TypeScript
- **Styling** : Tailwind CSS + Angular Material
- **Backend** : JSON-Server (simulation REST API)
- **Base de Données** : db.json (développement)
- **Routing** : Angular Router avec guards

### Services Principaux
- **AuthService** : Gestion de l'authentification
- **SeancesService** : CRUD des séances avec intégration exercices
- **ExercicesService** : Gestion complète des exercices
- **HistoriqueService** : Suivi des entraînements réalisés
- **ToastService** : Notifications utilisateur
- **CategorieService** : Gestion complète des catégories des séances

## Ressources

<img width="497" height="325" alt="image" src="https://github.com/user-attachments/assets/5bd82cc4-2e51-4894-8fb0-dfef5324b68e" />

<img width="773" height="606" alt="image" src="https://github.com/user-attachments/assets/7995691b-7f00-48b2-af4e-e2b4d272734f" />



