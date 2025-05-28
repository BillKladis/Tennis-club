const dummyData = {
    1: Array.from({ length: 25 }, (_, i) => ({ title: `Κράτηση ${i + 1}`, url: `pdfs/reservation${i + 1}.pdf` })),
    2: Array.from({ length: 18 }, (_, i) => ({ title: `Αίτηση Τμήματος ${i + 1}`, url: `pdfs/request${i + 1}.pdf` })),
    3: Array.from({ length: 22 }, (_, i) => ({ title: `Συμμετοχή Τουρνουά ${i + 1}`, url: `pdfs/participation${i + 1}.pdf` })),
  };
  
  const state = {
    1: 0,
    2: 0,
    3: 0
  };
  
  const itemsPerPage = 10;
  
  function renderBox(boxId) {
    const container = document.getElementById(`data-rows-${boxId}`);
    container.innerHTML = '';
  
    const start = state[boxId] * itemsPerPage;
    const end = start + itemsPerPage;
    const dataSlice = dummyData[boxId].slice(start, end);
  
    dataSlice.forEach(item => {
      const div = document.createElement('div');
      div.className = 'data-row';
  
      // Δημιουργούμε έναν σύνδεσμο για το PDF με εικονίδιο
      const pdfLink = document.createElement('a');
      pdfLink.href = item.url;
      pdfLink.target = '_blank';
      pdfLink.rel = 'noopener noreferrer';
      pdfLink.textContent = item.title;
      pdfLink.style.color = '#04AA6D';
      pdfLink.style.textDecoration = 'underline';
  
      // ΠΡΟΣΘΗΚΗ εικονιδίου PDF (χρησιμοποιούμε Font Awesome)
      const icon = document.createElement('i');
      icon.className = 'fas fa-file-pdf';
      icon.style.color = 'red';
      icon.style.marginRight = '10px';
  
      div.appendChild(icon);
      div.appendChild(pdfLink);
      container.appendChild(div);
    });
  }
  
  document.querySelectorAll('.prev-btn').forEach(button => {
    button.addEventListener('click', () => {
      const boxId = button.dataset.box;
      if (state[boxId] > 0) {
        state[boxId]--;
        renderBox(boxId);
      }
    });
  });
  
  document.querySelectorAll('.next-btn').forEach(button => {
    button.addEventListener('click', () => {
      const boxId = button.dataset.box;
      const maxPage = Math.floor((dummyData[boxId].length - 1) / itemsPerPage);
      if (state[boxId] < maxPage) {
        state[boxId]++;
        renderBox(boxId);
      }
    });
  });
  
  [1, 2, 3].forEach(renderBox);
  