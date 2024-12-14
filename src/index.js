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
  // win.webContents.openDevTools();
  win.loadFile("src/index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Miller-Rabin algoritmini amalga oshirish

// Modulli darajaga ko'tarish

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
