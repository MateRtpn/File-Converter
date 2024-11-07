
function openModal(imgSrc) {
  const modal = document.getElementById('modal');
  const modalImage = document.getElementById('modalImage');
  const caption = document.getElementById('caption');

  modal.style.display = 'flex';
  modalImage.src = imgSrc;


  const fileName = imgSrc.split('/').pop().split('.')[0];
  caption.textContent = fileName; 
}



document.getElementById('closeModal').addEventListener('click', () => {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';  
});

document.getElementById('fileInput').addEventListener('change', async () => {
  const previewSection = document.getElementById('previewSection');
  previewSection.innerHTML = '';

  const files = Array.from(document.getElementById('fileInput').files);


  files.sort((a, b) => a.name.localeCompare(b.name));

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      continue;
    }

    const img = await readImageFile(file);
    img.className = 'preview-image';


    const fileNameWithoutExtension = file.name.split('.')[0];


    img.addEventListener('click', function() {
      openModal(img.src);
    });

    previewSection.appendChild(img);
  }
});




function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => resolve(img); 
    };
    reader.onerror = reject; 
    reader.readAsDataURL(file);
  });
}

document.getElementById('convertButton').addEventListener('click', () => {
  const files = document.getElementById('fileInput').files;
  const format = document.getElementById('formatSelect').value;

  if (files.length === 0) {
    alert('Please upload at least one valid image file');
    return;
  }


  

  if (files.length === 1) {
    convertAndDownload(files[0], format);
  } else {
    const zip = new JSZip();
    let processedFiles = 0;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = function() {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const dataURL = canvas.toDataURL(`image/${format}`);
          const binary = atob(dataURL.split(',')[1]);
          const array = [];

          for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
          }

          const blob = new Blob([new Uint8Array(array)], { type: `image/${format}` });
          zip.file(`converted-${file.name.split('.')[0]}.${format}`, blob);

          processedFiles++;
          if (processedFiles === files.length) {
            zip.generateAsync({ type: 'blob' }).then(function(content) {
              const link = document.createElement('a');
              link.href = URL.createObjectURL(content);
              link.download = 'converted_files.zip';
              link.click();
            });
          }
        };
      };
      reader.readAsDataURL(file);
    });
  }
});




function convertAndDownload(file, format) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.src = e.target.result;

    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const dataURL = canvas.toDataURL(`image/${format}`);
      const binary = atob(dataURL.split(',')[1]);
      const array = [];

      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }

      const blob = new Blob([new Uint8Array(array)], { type: `image/${format}` });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${file.name.split('.')[0]}.${format}`; 
      link.click();
    };
  };
  reader.readAsDataURL(file);
}
