# E‑commerce Microservices Application

## Présentation 

Cette application e‑commerce en microservices est un projet académique visant à démontrer la conception et le déploiement d’une plateforme cloud-native. Chaque service (authentification, produits, commandes, frontend) fonctionne de manière autonome dans des conteneurs Docker, facilitant la scalabilité et la maintenabilité.

## Fonctionnalités

* **Authentification & autorisation** : inscription / connexion via JWT, protection des routes.
* **Catalogue produits** : CRUD complet (création, lecture, mise à jour, suppression) des produits.
* **Gestion des commandes** : création et consultation des commandes, vérification de stock inter‑service.
* **Front‑end React** : interface responsive (Login, Catalogue, Mes commandes, Gestion produits).
* **Conteneurisation & déploiement** : Docker Compose orchestre tous les services.

## Architecture

```text
app-network ──┬─ auth-service (Express, port 5001)
              ├─ product-service (Express, port 5002)
              ├─ order-service (Express, port 5003)
              ├─ frontend (React, port 3000)
              └─ mongodb (port 27017)
```

* Chaque service dispose de sa propre base de données MongoDB.
* Communication via API REST et file d’attente RabbitMQ pour les événements critiques.

##  Stack Technique

| Composant        | Technologie            |
| ---------------- | ---------------------- |
| Backend services | Node.js, Express       |
| Base de données  | MongoDB                |
| Auth & sécurité  | JWT, bcrypt            |
| Front‑end        | React.js, Bootstrap    |
| Conteneurisation | Docker, Docker Compose |
| Hébergement demo | AWS EC2                |

##  Prérequis

* Docker & Docker Compose
* Node.js (v18+) et npm

## Installation et exécution locale

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/AZIZABADA10/microservices-app-e-commerce.git
   cd microservices-app-e-commerce
   ```
2. Créez un fichier `.env` pour chaque service (ex. `auth-service/.env`) à partir des exemples `.env.example` : définissez les variables MONGODB\_URI, JWT\_SECRET, RABBITMQ\_URL, etc.
3. Démarrez l’ensemble avec Docker Compose :

   ```bash
   docker-compose up --build
   ```
4. Accédez au front‑end : [http://localhost:3000](http://localhost:3000)

## 📚 Endpoints Principaux

### Auth‑service (port 5001)

| Route                | Méthode | Description                   |
| -------------------- | ------- | ----------------------------- |
| `/api/auth/register` | POST    | Inscription utilisateur       |
| `/api/auth/login`    | POST    | Connexion et obtention du JWT |

### Product‑service (port 5002)

| Route               | Méthode | Description                    |
| ------------------- | ------- | ------------------------------ |
| `/api/products`     | GET     | Liste tous les produits        |
| `/api/products`     | POST    | Crée un nouveau produit        |
| `/api/products/:id` | PUT     | Met à jour un produit existant |
| `/api/products/:id` | DELETE  | Supprime un produit            |

### Order‑service (port 5003)

| Route         | Méthode | Description                      |
| ------------- | ------- | -------------------------------- |
| `/api/orders` | GET     | Liste toutes les commandes       |
| `/api/orders` | POST    | Crée une commande (vérif. stock) |

##  Docker

* Le fichier `docker-compose.yml` orchestre 6 services (frontend, auth, product, order, mongodb,RabbitMQ).
* Volumes persistants pour MongoDB.
* Réseau interne `app-network` pour communication sécurisée.


*Développé par AZIZ ABADA – Étudiant WEB Full‑Stack*
