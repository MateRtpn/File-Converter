document.getElementById('convertButton').addEventListener('click', () => {
  const fileInput = document.getElementById('fileInput').files[0];
  const format = document.getElementById('formatSelect').value;

  if (!fileInput || !fileInput.type.startsWith('image/')) {
    alert('Please upload a valid image file');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.src = e.target.result;
    img.onload = function() {
      if (format === 'pdf') {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        pdf.addImage(img, 'JPEG', 10, 10, 180, 160);
        pdf.save('converted.pdf');
      } else {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const dataURL = canvas.toDataURL(`image/${format}`);
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `converted.${format}`;
        link.click();
      }
    };
  };
  reader.readAsDataURL(fileInput);
});
