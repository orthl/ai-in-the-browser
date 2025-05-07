import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers";

// Lokale Modelle nicht erlauben
env.allowLocalModels = false;

// HTML-Elemente abrufen
const fileInput = document.getElementById("file-input"); // Eingabefeld für Bilddatei
const resultImage = document.getElementById("image-container"); // Bereich zur Anzeige des Bildes und der Ergebnisse
const resultText = document.getElementById("result"); // Bereich zur Anzeige des Status und der Analyseergebnisse

// Status Ladevorgangs
resultText.textContent = "Modell wird geladen ...";

// Modell initialisieren
const model = await pipeline("object-detection", "Xenova/detr-resnet-50");

// Status Modell bereit
resultText.textContent = "Modell ist einsatzbereit!";

// Listener Datei-Upload
fileInput.addEventListener("change", function (e) {
  // Hochgeladene Datei abrufen
  const file = e.target.files[0]; 
  if (!file) {
    return;
  }

  // FileReader zum lesen der Datei
  const reader = new FileReader(); 

  // Bild anzeigen
  reader.onload = function (e2) {
    resultImage.innerHTML = ""; 
    const image = document.createElement("img"); 
    image.src = e2.target.result; 
    resultImage.appendChild(image); 
    detect(image); 
  };

  // Bilddatei laden
  reader.readAsDataURL(file); 

  // Analyse des Bildes
  async function detect(img) {
    // Status Analyse
    resultText.textContent = "Bild wird analysiert...";

    // Startzeit messen
    const startTime = performance.now();

    // Modell anwenden
    const output = await model(img.src, {
      threshold: 0.75, // Schwellenwert für die Erkennung
      percentage: true, // Ergebnisse in Prozent ausgeben
    });

    // Endzeit messen
    const endTime = performance.now();

    // Berechnung der Inferenzzeit
    const inferenceTime = endTime - startTime;
    console.log(`Inferenzzeit: ${inferenceTime.toFixed(2)} ms`);

    // Ergebnis anzeigen
    resultText.textContent = "Ergebnis siehe Bild!";
    console.log("output", output);

    // Bounding-Boxen erstellen
    output.forEach(renderBox);
  }

  // Bounding-Box einfügen
  function renderBox({ box, label }) {
    const { xmax, xmin, ymax, ymin } = box; // Koordinaten der Bounding-Box abrufen

    // Zufällige Farbe für die Box generieren
    const color = "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, 0);

    // Bounding-Box zeichnen
    const boxElement = document.createElement("div");
    boxElement.className = "bounding-box"; // CSS-Klasse
    Object.assign(boxElement.style, {
      borderColor: color, // Farbe der Box
      left: 100 * xmin + "%", // Linke Position
      top: 100 * ymin + "%", // Obere Position
      width: 100 * (xmax - xmin) + "%", // Breite der Box
      height: 100 * (ymax - ymin) + "%", // Höhe der Box
    });

    // Bounding-Box labeln
    const labelElement = document.createElement("span");
    labelElement.textContent = label; // Inhalt
    labelElement.className = "bounding-box-label"; // CSS-Klasse
    labelElement.style.backgroundColor = color; // Hintergrundfarbe

    // Label anhängen und Bounding-Box anzeigen
    boxElement.appendChild(labelElement);
    resultImage.appendChild(boxElement); 
  }
});
