function sha1(str) {
  const buffer = new TextEncoder("utf-8").encode(str);
  return crypto.subtle.digest("SHA-1", buffer).then((hash) =>
    Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

function generateColorsFromHash(hash) {
  return ["#" + hash.slice(0, 6), "#" + hash.slice(6, 12)];
}

function generateGradientImage(ctx, color1, color2, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const noiseDensity = 0.1;
  const totalPixels = Math.floor(width * height * noiseDensity);
  for (let i = 0; i < totalPixels; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const alpha = Math.random() * 0.08;
    const gray = Math.floor(Math.random() * 255);
    ctx.fillStyle = `rgba(${gray},${gray},${gray},${alpha})`;
    ctx.fillRect(x, y, 1, 1);
  }
}

document.getElementById("generateBtn").addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput");
  const width = document.getElementById("width");
  const height = document.getElementById("height");
  const file = fileInput.files[0];
  if (!file) {
    alert("Please upload a file first.");
    return;
  }

  if (width.value <= 0 || height.value <= 0) {
    alert("Please enter width and height.");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (e) {
    const content = e.target.result;
    const hash = await sha1(content);
    const [color1, color2] = generateColorsFromHash(hash);

    const previewCanvas = document.getElementById("previewCanvas");
    const previewCtx = previewCanvas.getContext("2d");
    generateGradientImage(
      previewCtx,
      color1,
      color2,
      previewCanvas.width,
      previewCanvas.height
    );

    const canvas = document.getElementById("gradientCanvas");
    canvas.width = width.value;
    canvas.height = height.value;
    const ctx = canvas.getContext("2d");
    generateGradientImage(ctx, color1, color2, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    const link = document.getElementById("downloadLink");
    link.href = imageData;
    link.style.display = "inline-block";
  };

  reader.readAsText(file);
});
