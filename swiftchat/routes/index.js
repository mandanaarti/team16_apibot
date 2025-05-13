const { Router } = require('express');
const controller = require('../controller');
const validate = require('../../middlewares/validator');
const schema = require('../schema');

const router = Router();

router.post('/kluster-webhook', validate(schema.klusterWebhook), controller.klusterWebhook);
router.post('/test/message-webhook', controller.messageWebhookTest);

module.exports = router;
