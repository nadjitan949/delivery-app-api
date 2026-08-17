# 📦 Delivery — Backend API

API backend d'une **plateforme de livraison locale** qui met en relation des **fournisseurs** (commerçants ayant des livraisons), des **livreurs** (couriers) et un **administrateur** qui supervise la plateforme et gère les conditions d'utilisation.

---

## 🧰 Stack technique

| Technologie | Rôle |
|-------------|------|
| **Node.js + Express 5** | Serveur & gestion des routes |
| **PostgreSQL** | Base de données relationnelle |
| **Sequelize 6** (ORM) | Modélisation & accès aux données |
| **JWT** (access / refresh) | Authentification |
| **bcrypt** | Hachage des mots de passe & OTP |
| **Zod** | Validation des données entrantes |
| **Multer + Cloudinary** | Upload & stockage des photos (véhicule, permis, plaque...) |
| **dotenv** | Gestion des variables d'environnement |

---

## ✅ Prérequis

Avant de commencer, assurez-vous d'avoir installé sur votre machine :

- [Node.js](https://nodejs.org/) (>= 18)
- [PostgreSQL](https://www.postgresql.org/) (serveur de base de données)
- Un compte [Cloudinary](https://cloudinary.com/) (pour l'upload des images)
- [Git](https://git-scm.com/)

---

## 🚀 Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/nadjitan949/delivery-app-api.git
cd backend

# 2. Installer les dépendances
npm install
```

---

## 🔧 Configuration des variables d'environnement

Créez un fichier **`.env`** à la racine du projet (`backend/`) et renseignez les champs suivants :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `PORT` | Port d'écoute du serveur | `3000` |
| `DB_NAME` | Nom de la base de données | `delivery_db` |
| `DB_USER` | Utilisateur PostgreSQL | `postgres` |
| `DB_PASSWORD` | Mot de passe PostgreSQL | `monmotdepasse` |
| `DB_HOST` | Hôte de la base de données | `localhost` |
| `CLOUD_NAME` | Cloud name Cloudinary | `moncloud` |
| `CLOUD_API_KEY` | API key Cloudinary | `1234567890` |
| `CLOUD_SECRETE` | API secret Cloudinary | `abcdefghij` |
| `ACCESS_JWT_SECRET` | Secret de signature des tokens d'accès | `une_chaine_aleatoire_secrete` |
| `ACCESS_JWT_EXPIRE_IN` | Durée de validité du token d'accès | `15m` |
| `REFRESH_JWT_SECRET` | Secret de signature des tokens de rafraîchissement | `une_autre_chaine_secrete` |
| `REFRESH_JWT_EXPIRE_IN` | Durée de validité du token de rafraîchissement | `7d` |

> ⚠️ **Bonnes pratiques** : ne commitez jamais votre fichier `.env`. Utilisez des secrets forts et différents pour les tokens access/refresh.
>
> 💡 Formats d'expiration JWT acceptés : `15m`, `1h`, `7d`, `30d`, etc.


---

## ▶️ Lancer le projet

```bash
# Mode développement (avec rechargement automatique via nodemon)
npm start
```

Au démarrage, le serveur :
1. Se connecte à **PostgreSQL** (`.env`)
2. **Synchronise automatiquement** les tables avec `sequelize.sync({ alter: true })` — vous n'avez pas besoin de créer les tables manuellement
3. Écoute sur `http://localhost:3000` (ou le `PORT` défini)

---

## 🌱 Remplir la base de données (Seeder)

Le projet inclut un seeder qui remplit toutes les tables avec des données de démonstration :

```bash
# Démarrez d'abord le serveur, puis :
POST http://localhost:3000/seeder/populate
```

Cela insère :
- **10 utilisateurs** (6 couriers, 3 fournisseurs, 1 admin) — mot de passe : `Password123`
- **6 profils livreurs** (véhicule, document, permis...)
- **4 politiques** d'utilisation (`generale` + 3 politiques de tarification)
- **6 tarifs** de livreurs (par minute / par km / négociable)
- Les **acceptations de politiques** correspondantes
- Quelques **OTP** de démonstration

Le seeder est **idempotent** : il vide les tables puis les repartit, il peut donc être relancé sans problème.

---

## 📁 Structure du projet

```
backend/
├── index.js                    # Point d'entrée (serveur + sync DB)
├── app.routes.js               # Assemblage des routes
├── config/
│   └── cloudinary.js           # Configuration Cloudinary
├── database/
│   ├── connection/db.js        # Connexion PostgreSQL (Sequelize)
│   └── models/
│       ├── tables/             # Définition des modèles
│       └── relations/          # Associations entre modèles
├── middleware/
│   ├── auth/                   # Protection des routes par token
│   ├── multer/                 # Upload de fichiers
│   └── validator/              # Validation Zod
├── modules/                    # Modules métier (auth, user, courier, otp, pricing, policy...)
│   └── <module>/
│       ├── <module>.route.js
│       ├── <module>.controller.js
│       ├── <module>.service.js
│       └── <module>.schema.js
├── messages/                   # Codes de réponse HTTP standardisés
├── seed/                       # Seeder de la base de données
└── utils/                      # Utilitaires
```

---

## 🗄️ Modèle de données

| Table | Description |
|-------|-------------|
| `users` | Utilisateurs (`supplier`, `courier`, `admin`) avec statut (`active`, `banned`, `suspended`, `inactive`) |
| `courier_profile` | Profil complémentaire des livreurs : documents, véhicule, permis, statut de vérification |
| `courier_pricing` | Tarification des livreurs (`per_minute`, `per_km`, `negotiable`) |
| `policies` | Conditions d'utilisation (`generale` + politiques de tarification) |
| `policy_acceptances` | Acceptation des politiques par les utilisateurs (table de liaison many-to-many) |
| `otps` | Codes de vérification à usage unique (inscription, mot de passe oublié, reset) |


---

## 🔗 API — Endpoints

> Toutes les routes sont préfixées dans `app.routes.js`. Exemple : `/auth/register`, `/users/all`, etc.

### 🔐 Authentification (`/auth`)

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/auth/register` | Envoie un code OTP à l'email ou au téléphone fourni |
| `POST` | `/otp/verify` | Confirme le code OTP et crée le compte (ou réinitialise le mot de passe) |
| `POST` | `/auth/login` | Connexion (email ou téléphone + mot de passe) → retourne access & refresh token |
| `POST` | `/auth/forgot-password` | Demande un code OTP pour un mot de passe oublié |
| `POST` | `/auth/reset-password` | Envoie un code OTP après vérification de l'ancien mot de passe |

🔑 **Flux d'inscription complet** :
1. `POST /auth/register` avec `email` ou `phone` → envoie un code à 6 chiffres
2. `POST /otp/verify` avec `email`/`phone` + `code` + `password` (et prénom/nom) → crée le compte

### 👤 Utilisateurs (`/users`)

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/users/all` | Liste des utilisateurs |
| `GET` | `/users/details/:id` | Détail d'un utilisateur |
| `POST` | `/users/create` | Créer un utilisateur |
| `PUT` | `/users/update/:id` | Mettre à jour un utilisateur |
| `PATCH` | `/users/reset-password/:id` | Réinitialiser le mot de passe |
| `PATCH` | `/users/activate/:id` | Activer un utilisateur |
| `PATCH` | `/users/ban/:id` | Bannir un utilisateur |
| `PATCH` | `/users/suspend/:id` | Suspendre un utilisateur |
| `PATCH` | `/users/deactivate/:id` | Désactiver un utilisateur |
| `DELETE` | `/users/delete/:id` | Supprimer un utilisateur |

### 🛵 Livreurs (`/courier`)

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/courier/complete-profile` | Compléter le profil livreur (upload photos : document, selfie, véhicule, plaque, permis) |
| `PUT` | `/courier/update-profile/:id` | Mettre à jour le profil livreur |
| `PATCH` | `/courier/under-review/:id` | Passer le profil en "examen" |
| `PATCH` | `/courier/verify/:id` | Vérifier le profil (admin) |
| `PATCH` | `/courier/reject/:id` | Rejeter le profil avec un motif |

> ℹ️ Gestion du statut des livreurs (ban/suspend/activate/deactivate) via le module livreur également.

### 🔢 OTP (`/otp`)

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/otp/all` | Liste des OTP |
| `GET` | `/otp/details/:id` | Détail d'un OTP |
| `POST` | `/otp/verify` | Vérifier un code (crée le compte / reset mot de passe) |
| `POST` | `/otp/resend` | Renvoyer un nouveau code |
| `DELETE` | `/otp/delete/:id` | Supprimer un OTP |

### 💰 Tarifs livreurs (`/pricing`)

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/pricing/all` | Liste des tarifs |
| `GET` | `/pricing/details/:id` | Détail d'un tarif |
| `POST` | `/pricing/add` | Ajouter un tarif à un livreur (nécessite `termsAccepted: true`) |
| `PUT` | `/pricing/update/:id` | Mettre à jour un tarif |
| `DELETE` | `/pricing/delete/:id` | Supprimer un tarif |

### 📜 Politiques (`/policies`)

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/policies/all` | Liste des politiques |
| `GET` | `/policies/details/:id` | Détail d'une politique |
| `POST` | `/policies/add` | Ajouter une politique |
| `PUT` | `/policies/update/:id` | Mettre à jour une politique |
| `DELETE` | `/policies/delete/:id` | Supprimer une politique |

### 🤝 Acceptations de politiques (`/policies-acceptance`)

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/policies-acceptance/all` | Liste des acceptations |
| `GET` | `/policies-acceptance/details/:id` | Détail d'une acceptation |

### 🌱 Seeder (`/seeder`)

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/seeder/populate` | Remplit la base avec des données de démonstration |


---

## 🧠 Logique métier (à noter)

- **Inscription avec OTP** : le code est haché (bcrypt) et expire après **5 minutes**. La vérification du code confirme la création du compte.
- **Tarifs livreurs** : selon le type choisi (`per_minute`, `per_km`, `negotiable`), les champs de prix non pertinents sont automatiquement mis à `null`, et l'acceptation de la politique de tarification correspondante (type `policy_pricing_<type>`) est automatiquement créée si elle n'existe pas.
- **Statut utilisateur** : les comptes `banned`, `suspended` ou `inactive` sont bloqués à la connexion.

---

## 🧪 Tests

Le projet n'inclut pas encore de suite de tests automatisés.

```bash
npm test   # (placeholder : "Error: no test specified")
```

---

## 📝 Notes & limites

- Les codes OTP sont actuellement **renvoyés en clair dans la réponse API** (pratique pour le développement) — à remplacer par un vrai service d'envoi d'email/SMS en production.
- La synchronisation des tables (`alter: true`) est effectuée automatiquement au démarrage du serveur.
- Le projet utilise `dotenv` : assurez-vous que votre fichier `.env` est présent avant de lancer l'application.

---

## 👥 Auteur

Projet réalisé dans le cadre d'une application de livraison locale. Pour toute question, contactez l'équipe de développement.

