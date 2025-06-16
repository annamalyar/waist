import React, { useRef, useState, useEffect } from "react";
export default function WaistEditor() {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [waistY, setWaistY] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [maskData, setMaskData] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.onload = () => setImage(img);
      img.src = URL.createObjectURL(file);
    }
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    if (Math.abs(y - waistY) < 10) setDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    setWaistY(y);
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    if (!canvasRef.current || !image) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    if (waistY !== null) {
      ctx.beginPath();
      ctx.moveTo(0, waistY);
      ctx.lineTo(canvas.width, waistY);
      ctx.strokeStyle = "magenta";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.font = "16px sans-serif";
      ctx.fillStyle = "magenta";
      ctx.fillText("Waist (editable)", 10, waistY - 10);
    }
  }, [image, waistY]);

  const analyzeImage = () => {
    if (!canvasRef.current || !image) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;

    let minWidth = Infinity;
    let minY = 0;

    for (let y = 50; y < height - 50; y++) {
      let xLeft = width;
      let xRight = 0;
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const r = data[index], g = data[index + 1], b = data[index + 2];
        const brightness = (r + g + b) / 3;
        if (brightness < 240) {
          if (x < xLeft) xLeft = x;
          if (x > xRight) xRight = x;
        }
      }
      const w = xRight - xLeft;
      if (w > 20 && w < minWidth) {
        minWidth = w;
        minY = y;
      }
    }
    setWaistY(minY);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={analyzeImage}>Auto-Detect Waist</button>
      <canvas
        ref={canvasRef}
        width={500}
        height={700}
        className="border"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <button onClick={() => alert(`Saved waistY: ${waistY}`)}>Save Waist Y</button>
    </div>
  );
}
