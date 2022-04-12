// Import de express-rate-limit pour limiter les tentatives de requêtes à l'API
const rateLimit = require ("express-rate-limit");

// Utilisation de rate-limit
const limiteConnexion = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 4, // Limiter à quatre tentatives
	message: "Vos tentatives ont échoué, vous pourrez réessayer dans 15 minutes",
});

// Export du middleware
module.exports = limiteConnexion;