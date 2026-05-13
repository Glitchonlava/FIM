let canvas;
let ctx;
let zoom = 1;
let omega = 1000;
let maxZoom = 100;
let minZoom = 0.01;
let points = [];
let offsetX = 0;
let offsetY = 0;

function init() {
  canvas = document.getElementById("fimCanvas");
  ctx = canvas.getContext("2d");
  
  // Set canvas size to window
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  
  // Mouse wheel zoom
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoom -= e.deltaY * 0.001;
    zoom = Math.max(minZoom, Math.min(maxZoom, zoom));
    draw();
  });
  
  // Click to add points
  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    points.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    draw();
  });
  
  // Slider control
  const slider = document.getElementById("omegaSlider");
  const valueDisplay = document.getElementById("omegaValue");
  slider.addEventListener("input", (e) => {
    omega = parseInt(e.target.value);
    valueDisplay.textContent = omega;
    draw();
  });
  
  draw();
}

function resizeCanvas() {
  const container = canvas.parentElement;
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  draw();
}

function draw() {
  ctx.fillStyle = "#141414";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  drawGrid();
  drawOmegaPlane();
  drawNumberLabels();
  drawInfinitesimals();
  drawFinitePoints();
}

function drawGrid() {
  ctx.strokeStyle = "rgba(80, 80, 80, 0.8)";
  ctx.lineWidth = 1;
  
  const step = 50 * zoom;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  // Vertical lines
  for (let x = centerX % step; x < canvas.width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  
  // Horizontal lines
  for (let y = centerY % step; y < canvas.height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawOmegaPlane() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = (omega * zoom) / 2;
  
  ctx.fillStyle = "rgba(255, 0, 0, 0.15)";
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Label
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.font = "24px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Ω", centerX, centerY);
}

function drawNumberLabels() {
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.font = "12px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  for (let i = 1; i <= 4; i++) {
    const val = omega / Math.pow(10, i);
    const x = centerX + val * zoom;
    
    if (x < canvas.width - 50) {
      ctx.fillText(`Ω - ${val.toFixed(0)}`, x + 5, centerY - 10);
    }
  }
}

function drawInfinitesimals() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  // Calculate distance from center
  const dx = centerX - canvas.width / 2;
  const dy = centerY - canvas.height / 2;
  const d = Math.sqrt(dx * dx + dy * dy);
  
  // Show infinitesimal zone if close to center
  if (d < 100 * zoom) {
    ctx.fillStyle = "rgba(0, 255, 255, 0.6)";
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 10 * zoom;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.fillStyle = "rgba(0, 255, 255, 0.9)";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Infinitesimal zone (ε)", centerX, centerY + 80 * zoom);
  }
}

function drawFinitePoints() {
  ctx.fillStyle = "rgba(0, 255, 0, 0.8)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.lineWidth = 1;
  
  for (let pt of points) {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  
  ctx.fillStyle = "rgba(0, 255, 0, 0.9)";
  ctx.font = "12px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  for (let pt of points) {
    ctx.fillText("finite", pt.x + 10, pt.y);
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
