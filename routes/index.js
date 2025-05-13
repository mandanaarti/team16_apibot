'use strict';

const { Router } = require('express');

const swiftchatRouter = require('../swiftchat/routes');

const router = Router();

router.use(swiftchatRouter);

module.exports = router;
