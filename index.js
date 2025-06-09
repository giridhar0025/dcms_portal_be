const app = require('./src/config/express');
const { connect: connectDB } = require('./src/config/database');
const { connectQueue } = require('./src/config/queue');

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();
  // await connectQueue();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
