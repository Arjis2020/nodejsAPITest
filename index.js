const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoute');
const videoRoutes = require('./routes/videoRoute');

app.use('/api', userRoutes);
app.use('/api', videoRoutes);
app.use(bodyParser.json());

app.listen(3000, () => {
    console.log("Server started on port 3000");
});