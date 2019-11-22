const healthtrac = require('./healthtrac');


module.exports = app => {
  app.use('/api/healthtrac/patients', healthtrac);
  
}