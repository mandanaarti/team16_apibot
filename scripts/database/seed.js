const { seedConfig } = require('./seed-config');
const { seedStrings } = require('./seed-strings');
const { seedUsers } = require('./seed-users');
const { seedStatsTables } = require('./seed-stats-tables');

const seed = async () => {
  await seedConfig();
  await seedStrings();
  await seedUsers();
  await seedStatsTables();
};

(async () => {
  await seed();
})();
