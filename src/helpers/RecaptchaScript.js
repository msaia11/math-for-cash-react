// RecaptchaScript.js

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('answerForm');

  if (!form) {
    alert("Form with id 'answerForm' not found.");
    return; // Exit if form is not found
  }

  alert("Form found, adding submit event listener.");

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const captchaResponse = grecaptcha.getResponse();
    alert("Event listerner is doing something");
    
    if (!captchaResponse) {
      alert("Please complete the reCAPTCHA.");
      return;
    }

    const formData = new FormData(e.target);
    const params = new URLSearchParams(formData);

    fetch('http://localhost:3000/upload', {
      method: "POST",
      body: params,
    })
    .then(res => res.json())
    .then(data => {
      if (data.captchaSuccess) {
        alert("Validation Successful");
        handleSubmitAnswer();
      } else {
        alert("Validation failed");
      }
    })
    .catch(err => alert(err));
  });
});
