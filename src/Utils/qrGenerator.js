// Helper to convert hex "#0a643a" to "10-100-58" format for QR generation
const hexToRgbDash = (hex, fallback = "10-100-58") => {
  if (!hex) return fallback;
  const clean = hex.replace("#", "").trim();
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `${r}-${g}-${b}`;
  }
  return fallback;
};

// Standard high-resolution QR Code image generator with custom color
export function generateQRCodeSVG(text, size = 280, color = "#0a643a", bgColor = "#ffffff") {
  const encoded = encodeURIComponent(text);
  const colorParam = hexToRgbDash(color, "10-100-58"); // #0a643a green theme
  const bgParam = hexToRgbDash(bgColor, "255-255-255");

  // Generates 100% standard, clean, ISO 18004 compliant green QR Code image
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&color=${colorParam}&bgcolor=${bgParam}&margin=2&format=svg`;

  return `<img src="${qrUrl}" alt="Live Attendance QR Code" width="${size}" height="${size}" class="w-full h-full object-contain rounded-lg select-none pointer-events-none" loading="eager" />`;
}

export default generateQRCodeSVG;
