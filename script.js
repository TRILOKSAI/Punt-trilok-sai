document.addEventListener("DOMContentLoaded", () => {
    const fontFamilySelect = document.getElementById("font-family");
    const fontWeightSelect = document.getElementById("font-weight");
    const italicToggle = document.getElementById("italic-toggle");
    const editor = document.getElementById("editor");

    let googleFonts = [];

    // Fetch the JSON file
    fetch('C:\Users\Trilok sai\OneDrive\Desktop\Punt-partners\puntfonts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            googleFonts = data;
            loadFontFamilyOptions();
            loadState();
        })
        .catch(error => {
            console.error('Error loading Google Fonts JSON:', error);
        });

    // Load fonts into the font family selector
    function loadFontFamilyOptions() {
        googleFonts.forEach(font => {
            const option = document.createElement("option");
            option.value = font.family;
            option.textContent = font.family;
            fontFamilySelect.appendChild(option);
        });
    }

    // Function to load weights for selected font family
    function loadFontWeights(fontFamily) {
        fontWeightSelect.innerHTML = "";
        const selectedFont = googleFonts.find(font => font.family === fontFamily);
        if (selectedFont) {
            selectedFont.weights.forEach(weight => {
                const option = document.createElement("option");
                option.value = weight;
                option.textContent = weight;
                fontWeightSelect.appendChild(option);
            });
        } else {
            console.error('Selected font family not found:', fontFamily);
        }
    }

    // Function to update the font style of the editor
    function updateFontStyle() {
        const fontFamily = fontFamilySelect.value;
        const fontWeight = fontWeightSelect.value;
        const isItalic = italicToggle.checked;

        editor.style.fontFamily = fontFamily;
        editor.style.fontWeight = fontWeight;
        editor.style.fontStyle = isItalic ? "italic" : "normal";

        saveState();
    }

    // Save state to local storage
    function saveState() {
        const state = {
            content: editor.value,
            fontFamily: fontFamilySelect.value,
            fontWeight: fontWeightSelect.value,
            isItalic: italicToggle.checked
        };
        localStorage.setItem("editorState", JSON.stringify(state));
    }

    // Load state from local storage
    function loadState() {
        const state = JSON.parse(localStorage.getItem("editorState"));
        if (state) {
            editor.value = state.content;
            fontFamilySelect.value = state.fontFamily;
            loadFontWeights(state.fontFamily);
            fontWeightSelect.value = state.fontWeight;
            italicToggle.checked = state.isItalic;
            updateFontStyle();
        } else {
            console.log('No saved state found in localStorage.');
        }
    }

    // Event listeners
    fontFamilySelect.addEventListener("change", () => {
        loadFontWeights(fontFamilySelect.value);
        updateFontStyle();
    });

    fontWeightSelect.addEventListener("change", updateFontStyle);
    italicToggle.addEventListener("change", updateFontStyle);
    editor.addEventListener("input", saveState);
});
