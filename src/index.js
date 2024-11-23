// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadFile("src/index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Miller-Rabin algoritmini amalga oshirish
function millerRabinTest(n, k = 5) {
  if (n <= 1 || n === 4) return false;
  if (n <= 3) return true;
  if (n % 2 === 0) return false;

  // n-1 ni (2^s * d) ko'rinishida yozish
  let d = n - 1;
  let s = 0;
  while (d % 2 === 0) {
    d = Math.floor(d / 2);
    s++;
  }

  // k marta tekshirish
  for (let i = 0; i < k; i++) {
    let a = 2 + Math.floor(Math.random() * (n - 4));
    let x = modularPow(a, d, n);

    if (x === 1 || x === n - 1) continue;

    let continueOuterLoop = false;
    for (let r = 1; r < s; r++) {
      x = modularPow(x, 2, n);
      if (x === 1) return false;
      if (x === n - 1) {
        continueOuterLoop = true;
        break;
      }
    }
    if (continueOuterLoop) continue;
    return false;
  }
  return true;
}

// Modulli darajaga ko'tarish
function modularPow(base, exponent, modulus) {
  if (modulus === 1) return 0;
  let result = 1;
  base = base % modulus;
  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result = (result * base) % modulus;
    }
    exponent = Math.floor(exponent / 2);
    base = (base * base) % modulus;
  }
  return result;
}

// IPC orqali renderer process bilan aloqa
ipcMain.on("check-prime", (event, number) => {
  const iterations = 20; // Aniqlik darajasi
  const isPrime = millerRabinTest(number, iterations);
  const probability = 1 - Math.pow(4, -iterations);
  event.reply("prime-result", {
    number: number,
    isPrime: isPrime,
    probability: probability,
    iterations: iterations,
  });
});
