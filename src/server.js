require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');
const recepcionRoutes = require('./routes/recepcionRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', recepcionRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
    sequelize.sync({ alter: true }).then(() => {
      console.log('Modelos sincronizados con la base de datos');
      app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
    });
  })
  .catch(err => console.error('Error al conectar a la base de datos:', err));