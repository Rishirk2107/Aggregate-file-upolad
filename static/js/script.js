function toggleForm(formId) {
    const forms = document.querySelectorAll('.form');
    forms.forEach(form => {
      form.classList.toggle('active-form', form.id === formId);
    });
  }
  