Voici un exemple de **README.md** professionnel et complet pour votre projet **microservices-app-e-commerce**, rédigé en français. Vous n’avez plus qu’à l’ajouter à la racine de votre dépôt :

```markdown
# Microservices App – E‑Commerce

Une application e‑commerce pédagogique construite sur une architecture **microservices** avec :  
- Un **frontend** React  
- Trois **backends** Node.js/Express  
  - auth-service (authentification, JWT)  
  - product-service (gestion des produits)  
  - order-service (gestion des commandes)  
- Une base de données **MongoDB**  
- Orchestration via **Docker Compose**

---

## Table des matières

1. [Architecture](#architecture)  
2. [Fonctionnalités](#fonctionnalités)  
3. [Prérequis](#prérequis)  
4. [Installation & configuration](#installation--configuration)  
5. [Démarrage des services](#démarrage-des-services)  
6. [API Endpoints](#api-endpoints)  
7. [Structure du projet](#structure-du-projet)  
8. [Tests](#tests)  
9. [Contribuer](#contribuer)  
10. [Auteur](#auteur)  
11. [Licence](#licence)  

---

## Architecture

```text
+-------------+      +----------------+     +----------------+     +-------------+
|             |      |                |     |                |     |             |
| Frontend    | <--> | auth-service   |     | product-service|     | order-service
|  React      |      | (port 5001)    |     | (port 5002)    |     | (port 5003) |
|  port 3000  |      +----------------+     +----------------+     +-------------+
|             |
+------+------+                                                       +-------------+
       |                                                              |             |
       |                                                              | MongoDB     |
       +--------------------------------------------------------------> port 27017  |
                                                                      +-------------+
```

Chaque service est isolé dans son propre conteneur Docker et communique via HTTP et la base MongoDB partagée.

---

## Fonctionnalités

- **auth-service**  
  - Inscription (`POST /api/auth/register`)  
  - Connexion (`POST /api/auth/login`)  
  - Génération et validation de JWT  

- **product-service**  
  - CRUD produits (`GET/POST/PUT/DELETE /api/products`)  

- **order-service**  
  - Création de commande (`POST /api/orders`)  
  - Consultation des commandes (`GET /api/orders`)  
  - Vérification automatique des produits via product-service  

- **Frontend React**  
  - Formulaires d’inscription et de connexion  
  - Affichage du catalogue de produits  
  - Passage de commandes  
  - Historique des commandes  
  - Gestion du token utilisateur et déconnexion  

---

## Prérequis

- Docker (version ≥ 20.10)  
- Docker Compose (version ≥ 1.27)  
- Node.js & npm (pour exécuter en local hors Docker, optionnel)  

---

## Installation & configuration

1. **Cloner** le dépôt :  
   ```bash
   git clone https://github.com/AZIZABADA10/microservices-app-e-commerce.git
   cd microservices-app-e-commerce
   ```

2. **Variables d’environnement**  
   Renommez les fichiers `.env.example` (à créer dans chaque service) en `.env` et ajustez :
   - `MONGO_URI` (ex. `mongodb://mongodb:27017/<nom_du_service>`)
   - `JWT_SECRET` (pour auth-service)
   - `PRODUCT_SERVICE_URL` (dans order-service, ex. `http://product-service:5002/api/products`)

3. **(Optionnel) Installation manuelle**  
   Dans chaque dossier de service (`auth-service`, `product-service`, `order-service`) et dans `frontend` :  
   ```bash
   npm install
   ```

---

## Démarrage des services

### Avec Docker Compose

```bash
docker-compose up --build
```

- **Frontend** : http://localhost:3000  
- **auth-service** : http://localhost:5001  
- **product-service** : http://localhost:5002  
- **order-service** : http://localhost:5003  
- **MongoDB** : port 27017  

### Sans Docker (pour le dev)

Dans chaque dossier, lancez :
```bash
npm run dev
```

---

## API Endpoints

| Service          | Méthode | Route                         | Description                         |
|------------------|---------|-------------------------------|-------------------------------------|
| auth-service     | POST    | `/api/auth/register`          | Enregistrement utilisateur          |
| auth-service     | POST    | `/api/auth/login`             | Authentification (JWT)              |
| product-service  | GET     | `/api/products`               | Récupérer tous les produits         |
| product-service  | GET     | `/api/products/:id`           | Récupérer un produit par ID         |
| product-service  | POST    | `/api/products`               | Créer un nouveau produit            |
| product-service  | PUT     | `/api/products/:id`           | Mettre à jour un produit            |
| product-service  | DELETE  | `/api/products/:id`           | Supprimer un produit                |
| order-service    | POST    | `/api/orders`                 | Passer une nouvelle commande        |
| order-service    | GET     | `/api/orders`                 | Lister les commandes de l’utilisateur |

Vous pouvez tester rapidement via Postman ou cURL une fois les conteneurs démarrés.

---

## Structure du projet

```text
microservices-app-ecommerce/
├── auth-service/         # Backend Auth (Express + Mongoose)
├── product-service/      # Backend Products (Express + Mongoose)
├── order-service/        # Backend Orders (Express + Mongoose)
├── frontend/             # Frontend React
├── docker-compose.yml    # Orchestration des conteneurs
└── README.md             # Ce fichier
```

Chaque service contient son propre `package.json`, ses routes, ses modèles Mongoose et une configuration Dockerfile.


---

## Auteur

**AZIZ ABADA**  
- GitHub : [AZIZABADA10](https://github.com/AZIZABADA10)

---