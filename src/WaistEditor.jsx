import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function WaistEditor() {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [waistY, setWaistY] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.onload = () => {
        console.log("✅ Image loaded:", img.width, img.height);
        setImage(img);
      };
      img.onerror = () => console.error("❌ Failed to load image");
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
    console.log("🔄 useEffect triggered", { image, waistY });
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
    if (!image) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let minWidth = Infinity;
    let minY = 0;
    for (let y = 50; y < height - 50; y++) {
      let xLeft = width;
      let xRight = 0;
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
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
    console.log("📏 Auto-detected waist Y:", minY);
    setWaistY(minY);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <Button onClick={analyzeImage}>Auto-Detect Waist</Button>
      <canvas
        ref={canvasRef}
        width={500}
        height={700}
        className="border"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <Button onClick={() => alert(`Saved waistY: ${waistY}`)}>Save Waist Y</Button>
    </div>
  );
}
