const skillProgressElements = document.querySelectorAll('.chart-bar');

    window.addEventListener('load', () => {
      skillProgressElements.forEach(element => {
        const targetWidth = element.dataset.skillLevel + '%';
        element.style.width = targetWidth;
      });
    });
