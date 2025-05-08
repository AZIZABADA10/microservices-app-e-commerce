## E‑commerce Microservices Application 
## Description
Cette application e‑commerce en microservices est un projet académique visant à démontrer la conception et le déploiement d’une plateforme cloud-native. Chaque service (authentification, produits, commandes, frontend) fonctionne de manière autonome dans des conteneurs Docker, facilitant la scalabilité et la maintenabilité.

## Table des matières

* [Fonctionnalités](#fonctionnalités)
* [Architecture](#architecture)
* [Stack Technique](#stack-technique)
* [Prérequis](#prérequis)
* [Installation & Exécution](#installation--exécution)
* [Variables d’environnement](#variables-denvironnement)
* [Endpoints API](#endpoints-api)
* [Docker](#docker)
* [Contribuer](#contribuer)
* [Auteur](#auteur)

## Fonctionnalités

* **Authentification & autorisation** : inscription et connexion sécurisées (JWT, bcrypt).
* **Catalogue produits** : opérations CRUD sur les produits.
* **Gestion des commandes** : création, consultation, et vérification de stock inter‑service.
* **Frontend React** : interface responsive (Login, Catalogue, Panier, Mes commandes, Gestion produits).
* **Messaging** : communication asynchrone via RabbitMQ pour les événements critiques.
* **Conteneurisation** : isolation des services avec Docker Compose.

## Architecture

```text
app-network ──┬─ auth-service (Express, port 5001)
              ├─ product-service (Express, port 5002)
              ├─ order-service (Express, port 5003)
              ├─ frontend (React, port 3000)
              ├─ mongodb (port 27017)
              └─ rabbitmq (port 5672)
```

Chaque service possède sa propre base de données MongoDB et communique en REST et via RabbitMQ.

## Stack Technique

| Composant        | Technologie            |
| ---------------- | ---------------------- |
| Backend services | Node.js, Express       |
| Base de données  | MongoDB                |
| Auth & sécurité  | JWT, bcrypt            |
| Front‑end        | React.js, Bootstrap    |
| Messaging        | RabbitMQ               |
| Conteneurisation | Docker, Docker Compose |

## Prérequis

* Docker & Docker Compose
* Node.js (v18+) et npm

## Installation & Exécution

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/AZIZABADA10/microservices-app-e-commerce.git
   cd microservices-app-e-commerce
   ```
2. Dupliquez les fichiers d’exemple d’environnement pour chaque service :

   ```bash
   cp auth-service/.env.example auth-service/.env
   cp product-service/.env.example product-service/.env
   cp order-service/.env.example order-service/.env
   ```
3. Éditez chaque `.env` pour configurer : `MONGODB_URI`, `JWT_SECRET`, `RABBITMQ_URL`, etc.
4. Démarrez tous les services :

   ```bash
   docker-compose up --build -d
   ```
5. Ouvrez votre navigateur : [http://localhost:3000](http://localhost:3000)

## Variables d’environnement

| Variable      | Service            | Description                         |
| ------------- | ------------------ | ----------------------------------- |
| MONGODB\_URI  | auth,product,order | URI de connexion MongoDB            |
| JWT\_SECRET   | auth-service       | Clé secrète pour signature JWT      |
| RABBITMQ\_URL | auth,product,order | URL de connexion RabbitMQ           |
| PORT          | chaque service     | Port d’écoute du service (ex. 5001) |

## Endpoints API

### Auth‑service (port 5001)

| Route                | Méthode | Description                   |
| -------------------- | ------- | ----------------------------- |
| `/api/auth/register` | POST    | Inscription utilisateur       |
| `/api/auth/login`    | POST    | Connexion et obtention du JWT |

### Product‑service (port 5002)

| Route               | Méthode | Description                    |
| ------------------- | ------- | ------------------------------ |
| `/api/products`     | GET     | Récupère tous les produits     |
| `/api/products`     | POST    | Crée un nouveau produit        |
| `/api/products/:id` | PUT     | Met à jour un produit existant |
| `/api/products/:id` | DELETE  | Supprime un produit            |

### Order‑service (port 5003)

| Route         | Méthode | Description                      |
| ------------- | ------- | -------------------------------- |
| `/api/orders` | GET     | Récupère toutes les commandes    |
| `/api/orders` | POST    | Crée une commande (vérif. stock) |

## Docker

* `docker-compose.yml` orchestre tous les services et dépendances (MongoDB, RabbitMQ).
* Les volumes garantissent la persistance des données.
* Réseau interne `app-network` pour communication sécurisée.



## Auteur

**AZIZ ABADA**
Étudiant Web-Full‑Stack

