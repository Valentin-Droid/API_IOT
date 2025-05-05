# Express + RabbitMQ API

## Prérequis

- Node.js >= 16
- RabbitMQ en fonctionnement (par défaut sur amqp://localhost)

## Installation

```sh
npm install
```

## Configuration

Vous pouvez configurer l’URL RabbitMQ et les noms de files via des variables d’environnement ou en modifiant `config.js` :

- `RABBITMQ_URL` (par défaut: amqp://localhost)
- `RABBITMQ_SEND_QUEUE` (par défaut: send_queue)
- `RABBITMQ_RECEIVE_QUEUE` (par défaut: receive_queue)
- `PORT` (par défaut: 3000)

## Lancement du serveur

```sh
npm start
```

## Endpoints

- `POST /send` : envoie un message JSON à RabbitMQ
  - Body exemple : `{ "text": "Hello" }`
- `GET /receive` : récupère un message de la file RabbitMQ

## Arrêt

Ctrl+C pour arrêter le serveur (fermeture propre de la connexion RabbitMQ).
