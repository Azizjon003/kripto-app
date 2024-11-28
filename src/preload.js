// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

// `contextBridge` yordamida renderer processga faqat kerakli API'larni taqdim etamiz
contextBridge.exposeInMainWorld("electron", {
  // `ipcRenderer` orqali eslatmalarni olish va saqlash
  getNotes: () => ipcRenderer.invoke("get-notes"),
  saveNote: (newNote) => ipcRenderer.invoke("save-note", newNote),
  openDevTools: () => ipcRenderer.send("open-dev-tools"),
});
