# 📦 e-contact-backend

**e-contact-backend** est la partie serveur de l'application web **e-contact**.  
Elle gère la logique métier, la communication avec la base de données MySQL, et expose une API RESTful utilisée par le frontend.

---

## Prérequis

- Node.js v18+
- MySQL (local ou distant)

---

## Structure du projet

backend-sql/
├── controllers/
├── routes/
├── models/
├── config/
├── middleware/
├── app.js
├── package.json
└── .env



## Configuration

Créer un fichier `.env` à la racine du dossier `backend-sql` :
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=!14glsi2005
DB_NAME=silexcarnet
DB_PORT=3306
JWT_SECRET=07silex2025
JWT_EXPIRES_IN=3d

# Assurez-vous que la base de données est déjà créée dans MySQL.

## Installation et lancement

cd backend-sql
npm install
node app.js

## Le serveur démarre sur : http://localhost:3005

# Stack technique
Node.js
Express.js
MySQL
Dotenv
CORS

# Exemple d'endpoint API

GET /api/users
POST /api/contacts

## Fonctionnalités principales
Authentification (login/signup)
CRUD sur les contacts
Intégration avec MySQL
API RESTful
