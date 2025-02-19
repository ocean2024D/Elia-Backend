# 🚀 Use Case Elia – Gestion des horaires de garde

Un serveur **Express.js** avec gestion des utilisateurs et des tâches, utilisant MongoDB, CORS et des middlewares personnalisés.  

## 📌 Fonctionnalités  
✅ Authentification des utilisateurs  
✅ Gestion des demandes d'échange de tâches  
❌ Gestion des tâches et planification  
❌ Formatage de l'heure pour le fuseau Europe/Brussels  
✅ Middleware global de gestion des erreurs  

---

## 🛠️ Pré-requis  

- [Node.js](https://nodejs.org/) installé  
- [MongoDB](https://www.mongodb.com/) en service  
- Un fichier `.env` avec la configuration suivante :  

```ini
PORT=5001
MONGO_URI=mongodb://localhost:27017/nom_de_ta_base
JWT_SECRET=ton_secret_pour_le_token
