```markdown
# 🛍️ Microservices App - E-Commerce (Node.js + React + Docker)

Ce projet est une application e-commerce pédagogique basée sur une architecture **microservices** avec un frontend React, un backend Node.js (Express), MongoDB, et une orchestration via Docker.

---

## 🧱 Architecture

| Service          | Port   | Description                              |
|------------------|--------|------------------------------------------|
| `auth-service`   | 5001   | Gère l'inscription, connexion, JWT       |
| `product-service`| 5002   | Gère les produits (CRUD)                 |
| `order-service`  | 5003   | Gère les commandes                       |
| `frontend`       | 3000   | Interface utilisateur React              |
| `mongodb`        | 27017  | Base de données NoSQL                    |

---

## 🚀 Lancer le projet avec Docker

### 🔧 Prérequis

- Docker et Docker Compose installés

### ▶️ Commande de lancement

```bash
docker-compose up --build
```

> L'application sera disponible sur : [http://localhost:3000](http://localhost:3000)

---

## 💻 Fonctionnalités

### ✅ Authentification (`auth-service`)
- Enregistrement (`/api/auth/register`)
- Connexion (`/api/auth/login`)
- Token JWT

### ✅ Produits (`product-service`)
- CRUD produits (GET, POST, PUT, DELETE)

### ✅ Commandes (`order-service`)
- Création et consultation des commandes
- Vérification des produits via `product-service`

### ✅ Frontend (`React`)
- Connexion / inscription
- Affichage de la liste des produits
- Passer une commande
- Historique des commandes
- Déconnexion

---

## 📁 Structure du projet

```
microservices-app-ecommerce/
├── auth-service/
├── product-service/
├── order-service/
├── frontend/
├── docker-compose.yml
└── README.md
```

---

## 🛠️ Technologies

- Node.js + Express
- MongoDB + Mongoose
- React + Axios + React Router
- Docker & Docker Compose

---

## 🧪 Test rapide via Postman

- POST `http://localhost:5001/api/auth/register`
- POST `http://localhost:5001/api/auth/login`
- GET `http://localhost:5002/api/products`
- POST `http://localhost:5003/api/orders`

---

## 👤 Auteur

- [AZIZ ABADA](https://github.com/AZIZABADA10)

---

## 📜 Licence

Ce projet est open source à des fins pédagogiques.
```