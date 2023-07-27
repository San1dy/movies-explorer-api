const express = require('express');
const cors = require('./middlewares/cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const PORT = process.env.PORT || 3000;
const app = express();
const limiter = require('./utils/limiter');
const { PORT_CONFIG, DB_CONFIG } = require('./utils/config');

mongoose.set('strictQuery', true);
mongoose.connect(DB_CONFIG);

app.use(helmet());
app.use(limiter);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT_CONFIG, () => {
  console.log(`App listening on port ${PORT_CONFIG}`);
});