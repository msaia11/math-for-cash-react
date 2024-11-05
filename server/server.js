const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.post('/upload', function (req, res) {
  const params = new URLSearchParams({
    secret: '6LdgDHIqAAAAAAfqrJWwh6R1jIfXk7uwU03NjhEh', // Ensure this is kept secure in a production environment
    response: req.body['g-recaptcha-response'],
    remoteip: req.ip
  });

  fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: "POST",
    body: params,
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        res.json({ captchaSuccess: true });
      } else {
        res.json({ captchaSuccess: false });
      }
    })
    .catch(error => {
      console.error("Error during reCAPTCHA verification:", error);
      res.status(500).json({ error: "reCAPTCHA verification failed" });
    });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});