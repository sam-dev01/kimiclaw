document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.decoding = 'async';
  });
});
