// Lightweight, standalone QR Code SVG generator (zero-dependency)
// Based on ISO/IEC 18004 QR Code specification

export function generateQRCodeSVG(text, size = 240, color = "#0a643a", bgColor = "#ffffff") {
  const qr = createQRCodeMatrix(text);
  const matrix = qr.modules;
  const count = matrix.length;
  const cellSize = size / count;

  let rects = [];
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (matrix[r][c]) {
        rects.push(
          `<rect x="${(c * cellSize).toFixed(2)}" y="${(r * cellSize).toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" fill="${color}" />`
        );
      }
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" shape-rendering="crispEdges">
      <rect width="${size}" height="${size}" fill="${bgColor}" />
      ${rects.join('')}
    </svg>
  `;
}

// Minimal QR Code Engine for alphanumeric/byte payload
function createQRCodeMatrix(text) {
  const typeNumber = getOptimalVersion(text.length);
  const errorCorrectionLevel = 1; // Level M
  return generateQR(typeNumber, errorCorrectionLevel, text);
}

function getOptimalVersion(length) {
  if (length < 32) return 3;
  if (length < 60) return 5;
  if (length < 120) return 8;
  if (length < 180) return 10;
  return 14;
}

// QR Code generator implementation
function generateQR(typeNumber, errorCorrectionLevel, data) {
  const PAD0 = 0xec;
  const PAD1 = 0x11;

  let modules = null;
  let moduleCount = typeNumber * 4 + 17;

  function initModules() {
    modules = new Array(moduleCount);
    for (let row = 0; row < moduleCount; row++) {
      modules[row] = new Array(moduleCount).fill(null);
    }
  }

  function setupPositionProbePattern(row, col) {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || moduleCount <= row + r) continue;
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || moduleCount <= col + c) continue;
        if (
          (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
          (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
          (2 <= r && r <= 4 && 2 <= c && c <= 4)
        ) {
          modules[row + r][col + c] = true;
        } else {
          modules[row + r][col + c] = false;
        }
      }
    }
  }

  function setupTimingPattern() {
    for (let r = 8; r < moduleCount - 8; r++) {
      if (modules[r][6] !== null) continue;
      modules[r][6] = r % 2 === 0;
    }
    for (let c = 8; c < moduleCount - 8; c++) {
      if (modules[6][c] !== null) continue;
      modules[6][c] = c % 2 === 0;
    }
  }

  function setupPositionAdjustPattern() {
    const pos = getPatternPosition(typeNumber);
    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        const row = pos[i];
        const col = pos[j];
        if (modules[row][col] !== null) continue;
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) {
              modules[row + r][col + c] = true;
            } else {
              modules[row + r][col + c] = false;
            }
          }
        }
      }
    }
  }

  function getPatternPosition(type) {
    if (type <= 1) return [];
    if (type === 2) return [6, 18];
    if (type === 3) return [6, 22];
    if (type === 4) return [6, 26];
    if (type === 5) return [6, 30];
    if (type === 6) return [6, 34];
    if (type === 7) return [6, 22, 38];
    if (type === 8) return [6, 24, 42];
    if (type === 9) return [6, 26, 46];
    if (type === 10) return [6, 28, 50];
    if (type === 11) return [6, 30, 54];
    if (type === 12) return [6, 32, 58];
    if (type === 13) return [6, 34, 62];
    return [6, 26, 46, 66];
  }

  function setupTypeInfo(test, maskPattern) {
    const data = (errorCorrectionLevel << 3) | maskPattern;
    const bits = getBCHTypeInfo(data);
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;
      if (i < 6) modules[i][8] = mod;
      else if (i < 8) modules[i + 1][8] = mod;
      else modules[moduleCount - 15 + i][8] = mod;

      if (i < 8) modules[8][moduleCount - i - 1] = mod;
      else if (i < 9) modules[8][15 - i - 1 + 1] = mod;
      else modules[8][15 - i - 1] = mod;
    }
    modules[moduleCount - 8][8] = !test;
  }

  function getBCHTypeInfo(data) {
    let d = data << 10;
    while (getBCHDigit(d) - getBCHDigit(0x537) >= 0) {
      d ^= 0x537 << (getBCHDigit(d) - getBCHDigit(0x537));
    }
    return ((data << 10) | d) ^ 0x5412;
  }

  function getBCHDigit(data) {
    let digit = 0;
    while (data !== 0) {
      digit++;
      data >>>= 1;
    }
    return digit;
  }

  function mapData(dataBytes, maskPattern) {
    let inc = -1;
    let row = moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;

    for (let col = moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      while (true) {
        for (let c = 0; c < 2; c++) {
          if (modules[row][col - c] === null) {
            let dark = false;
            if (byteIndex < dataBytes.length) {
              dark = ((dataBytes[byteIndex] >>> bitIndex) & 1) === 1;
            }
            const mask = getMask(maskPattern, row, col - c);
            if (mask) dark = !dark;
            modules[row][col - c] = dark;
            bitIndex--;
            if (bitIndex === -1) {
              byteIndex++;
              bitIndex = 7;
            }
          }
        }
        row += inc;
        if (row < 0 || moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  }

  function getMask(maskPattern, i, j) {
    switch (maskPattern) {
      case 0: return (i + j) % 2 === 0;
      case 1: return i % 2 === 0;
      case 2: return j % 3 === 0;
      case 3: return (i + j) % 3 === 0;
      case 4: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
      case 5: return ((i * j) % 2) + ((i * j) % 3) === 0;
      case 6: return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0;
      case 7: return (((i * j) % 3) + ((i + j) % 2)) % 2 === 0;
      default: return false;
    }
  }

  function createDataBytes() {
    const buffer = [];
    buffer.push(4); // 8-bit mode indicator
    buffer.push(data.length); // character count
    for (let i = 0; i < data.length; i++) {
      buffer.push(data.charCodeAt(i));
    }
    const totalBytes = getTotalDataBytes(typeNumber);
    while (buffer.length < totalBytes) {
      buffer.push(buffer.length % 2 === 0 ? PAD0 : PAD1);
    }
    return buffer.slice(0, totalBytes);
  }

  function getTotalDataBytes(type) {
    const capacities = [0, 16, 28, 44, 64, 86, 108, 124, 154, 182, 216, 254, 290, 334, 365];
    return capacities[type] || 250;
  }

  initModules();
  setupPositionProbePattern(0, 0);
  setupPositionProbePattern(moduleCount - 7, 0);
  setupPositionProbePattern(0, moduleCount - 7);
  setupPositionAdjustPattern();
  setupTimingPattern();
  setupTypeInfo(false, 0);
  mapData(createDataBytes(), 0);

  return { modules };
}
