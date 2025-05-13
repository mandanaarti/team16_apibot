module.exports = {
  validateMcq: (maxAnswer) =>
    `Kindly answer with a number between *1* and *${maxAnswer}*.`,
  unregisterMessage: 'User resetted succesfully.',
  redisLockMessage:
    'कृपया तब तक प्रतीक्षा करें जब तक हम आपका पिछला संदेश संसाधित कर रहे हैं।',
  studentValidationLockMessage:
    'कृपया प्रतीक्षा करें जब तक हम आपकी सारांश रिपोर्ट ला रहे हैं।',
  typeExceptionMessage: `यह मान्य इनपुट प्रकार नहीं है. कृपया किसी अन्य इनपुट पद्धति का उपयोग करें.`,
  invalidLocationMessage: `अमान्य निवेश! स्थान में वैध अक्षांश और देशांतर होना चाहिए।`,
};
