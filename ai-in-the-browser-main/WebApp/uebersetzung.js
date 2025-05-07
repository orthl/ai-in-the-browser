import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers";

// Lokale Modelle nicht erlauben
env.allowLocalModels = false;

// HTML-Elemente abrufen
const inputText = document.getElementById("input-text");
const resultText = document.getElementById("result");
const checkButton = document.getElementById("check-button");

// Status Ladevorgangs
resultText.textContent = "Modell wird geladen ...";

// Modell initialisieren
const model = await pipeline("translation", "Xenova/opus-mt-en-de");
// const model = await pipeline("translation", "Xenova/opus-mt-en-de", {device:"webgpu"},);


// Status Modell bereit
resultText.textContent = "Modell ist einsatzbereit!";

// Listener Button-Klick
checkButton.addEventListener("click", async () => {
    // Text aus Input-Feld abrufen
    const textToTranslate = inputText.value;

    // Listener Button-Klick
    if (textToTranslate.trim() === "") {
        resultText.textContent = "Bitte gib einen Text ein.";
    return;
    }
    
    // Status Übersetzung 
    resultText.textContent = "Übersetzung läuft ...";

    // Startzeit messen
    const startTime = performance.now();

    // Eingabetext mit Anweisung an Modell vorbereiten
    const translationInput = `${textToTranslate}`;
    
    // Modell anweisen zu übersetzen
    const translated = await model(translationInput);

    // Endzeit messen
    const endTime = performance.now();

    // Berechnung der Inferenzzeit
    const inferenceTime = endTime - startTime;
    console.log(`Inferenzzeit: ${inferenceTime.toFixed(2)} ms`);
    
    // Übersetzung anzeigen
    resultText.textContent = translated[0].translation_text;
});
