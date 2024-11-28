// Renderer processda now 'electron' global obyekti mavjud
const addNoteBtn = document.getElementById("add-note-btn");
const noteModal = document.getElementById("note-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const saveNoteBtn = document.getElementById("save-note-btn");
const noteInput = document.getElementById("note-input");
const categorySelect = document.getElementById("category");
const notesContainer = document.getElementById("notes-container");

// Eslatmalarni olish va render qilish
async function loadNotes() {
  const notes = await window.electron.getNotes(); // preload.js orqali
  renderNotes(notes);
}

// Eslatmalarni render qilish
function renderNotes(notes) {
  notesContainer.innerHTML = "";
  if (notes.length === 0) {
    notesContainer.innerHTML =
      '<p class="placeholder">Hozircha eslatmalar mavjud emas.</p>';
    return;
  }

  notes.forEach((note) => {
    const noteCard = document.createElement("div");
    noteCard.className = `note-card ${note.category}`;

    const noteText = document.createElement("p");
    noteText.textContent = note.text;

    const noteCategory = document.createElement("p");
    noteCategory.className = "note-category";
    noteCategory.textContent =
      note.category.charAt(0).toUpperCase() + note.category.slice(1);

    const noteTime = document.createElement("p");
    noteTime.className = "note-time";
    noteTime.textContent = `Vaqt: ${note.time}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "O‘chirish";
    deleteBtn.addEventListener("click", () => {
      notes = notes.filter((n) => n.id !== note.id);
      window.electron.saveNote(notes); // Eslatmani saqlash
      renderNotes(notes);
    });

    noteCard.appendChild(noteText);
    noteCard.appendChild(noteCategory);
    noteCard.appendChild(noteTime);
    noteCard.appendChild(deleteBtn);
    notesContainer.appendChild(noteCard);
  });
}

// Yangi eslatma qo'shish tugmasi bosilganda modalni ochish
addNoteBtn.addEventListener("click", () => {
  noteModal.classList.remove("hidden"); // Modalni ochish
});

// Modalni yopish
closeModalBtn.addEventListener("click", () => {
  noteModal.classList.add("hidden"); // Modalni yopish
  noteInput.value = ""; // Modalni yopganda inputni tozalash
});

// Eslatmani saqlash
saveNoteBtn.addEventListener("click", async () => {
  const noteText = noteInput.value.trim();
  const category = categorySelect.value;
  const timestamp = new Date().toLocaleString();

  if (noteText) {
    const newNote = {
      id: Date.now(),
      text: noteText,
      category: category,
      time: timestamp,
    };

    await window.electron.saveNote(newNote); // Yangi eslatmani saqlash
    noteModal.classList.add("hidden"); // Modalni yopish
    noteInput.value = ""; // Inputni tozalash
    loadNotes(); // Eslatmalarni qayta yuklash
  }
});

loadNotes();
