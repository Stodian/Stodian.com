const express = require('express');
const app = express();
const port = 3306;

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html'); // Send index.html file on accessing root URL
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

