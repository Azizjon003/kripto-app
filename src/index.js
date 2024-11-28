const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs"); // Fayl tizimi moduli

let mainWindow;
const databasePath = path.join(__dirname, "notes", "database.json");

// Eslatmalarni o'qish
function readNotesFromFile() {
  try {
    const data = fs.readFileSync(databasePath, "utf8");
    return JSON.parse(data); // JSON formatidan obyektga o'tkazish
  } catch (error) {
    console.error("Xato: Eslatmalarni o‘qishda xatolik yuz berdi.", error);
    return [];
  }
}

// Eslatmalarni yozish
function saveNotesToFile(notes) {
  try {
    fs.writeFileSync(databasePath, JSON.stringify(notes, null, 2), "utf8");
  } catch (error) {
    console.error("Xato: Eslatmalarni saqlashda xatolik yuz berdi.", error);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  console.log(path.join(__dirname, "preload.js"));
  mainWindow.loadFile("src/index.html");
}

app.whenReady().then(() => {
  createWindow();

  // Eslatmalarni yuklash va frontendga yuborish
  ipcMain.handle("get-notes", () => {
    return readNotesFromFile(); // JSON faylidan o'qigan eslatmalarni qaytarish
  });

  // Eslatmani saqlash
  ipcMain.handle("save-note", (event, newNote) => {
    const notes = readNotesFromFile();
    notes.push(newNote); // Yangi eslatmani qo'shish
    saveNotesToFile(notes); // Eslatmalarni faylga saqlash
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
});
