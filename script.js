function searchWord() {
  const word = document.getElementById("wordInput").value.trim();
  const resultDiv = document.getElementById("result");

  if (!word) {
    resultDiv.innerHTML = `<p style="color: red;">⚠️ Please enter a word!</p>`;
    return;
  }

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Word not found");
      }
      return response.json();
    })
    .then((data) => {
      const entry = data[0];
      const meaning = entry.meanings?.[0];
      const definition = meaning?.definitions?.[0];

      if (!definition) throw new Error("Incomplete data");

      // 🎧 Get audio URL
      const audio = entry.phonetics?.find(p => p.audio);
      const audioUrl = audio?.audio || null;

      // 📚 Phonetic text
      const phoneticText = audio?.text || entry.phonetic || "N/A";

      // 🟢 Synonyms
      const synonyms = definition.synonyms?.length
        ? definition.synonyms.slice(0, 5).join(", ")
        : "None";

      // ✍️ Example sentence
      const exampleText = definition.example
        ? `"${definition.example}"`
        : null;

      // 🖼️ Display result
      resultDiv.innerHTML = `
        <h2 id="wordTitle">${entry.word}</h2>
        <p id="phonetics">Pronunciation: ${phoneticText}</p>
        <p id="partOfSpeech">Part of Speech: ${meaning.partOfSpeech}</p>
        <p id="definition">Definition: ${definition.definition}</p>
        ${exampleText ? `<p id="example"><strong>Example:</strong> ${exampleText}</p>` : ""}
        <p id="synonyms">Synonyms: ${synonyms}</p>
        ${
          audioUrl
            ? `<button id="playAudio">🔊 Play Pronunciation</button>`
            : `<p style="color: gray;">🔇 No audio available</p>`
        }
      `;

      // 🔊 Play audio
      if (audioUrl) {
        document.getElementById("playAudio").addEventListener("click", () => {
          const audio = new Audio(audioUrl);
          audio.play();
        });
      }
    })
    .catch(() => {
      resultDiv.innerHTML = `<p style="color: red;">❌ Word not found. Try another one!</p>`;
    });
    // 🌙 Toggle Dark Mode
    document.getElementById("themeToggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

  // Optional: Change button text/icon when toggled
    const isDark = document.body.classList.contains("dark-mode");
    this.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    });

}
