/*const API_URL = "http://127.0.0.1:5000/predict";

const input = document.getElementById("commentInput");
const button = document.getElementById("checkBtn");
const result = document.getElementById("result");

const toggle = document.getElementById("toggle");
const status = document.getElementById("status");

chrome.storage.sync.get(["enabled"],(data)=>{

    const enabled = data.enabled ?? true;

    toggle.checked = enabled;

    updateStatus(enabled);

});

toggle.addEventListener("change",()=>{

    chrome.storage.sync.set({
        enabled: toggle.checked
    });

    updateStatus(toggle.checked);

});

function updateStatus(state){

    status.textContent = state
        ? "Protection Enabled"
        : "Protection Disabled";

}

button.onclick = async ()=>{

    const text = input.value;

    if(!text) return;

    const response = await fetch(API_URL,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({comment:text})
    });

    const data = await response.json();

    const score = Math.max(
        data.toxic,
        data.insult,
        data.obscene,
        data.identity_hate
    );

    result.innerHTML = `
        Toxicity Score: ${(score*100).toFixed(1)}%
    `;

};




const API_URL = "http://127.0.0.1:5000/predict";

const input = document.getElementById("commentInput");
const button = document.getElementById("checkBtn");
const result = document.getElementById("result");

const toggle = document.getElementById("toggle");
const status = document.getElementById("status");

chrome.storage.sync.get(["enabled"],(data)=>{

    const enabled = data.enabled ?? true;

    toggle.checked = enabled;

    updateStatus(enabled);

});

toggle.addEventListener("change",()=>{

    chrome.storage.sync.set({
        enabled: toggle.checked
    });

    updateStatus(toggle.checked);

});

function updateStatus(state){

    status.textContent = state
        ? "Protection Enabled"
        : "Protection Disabled";

}

button.onclick = async ()=>{

    const text = input.value;

    if(!text) return;

    const response = await fetch(API_URL,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({comment:text})
    });

    const data = await response.json();

    const score = Math.max(
        data.toxic,
        data.insult,
        data.obscene,
        data.identity_hate
    );

    const percent = (score*100).toFixed(1);

result.innerHTML = percent > 50
    ? `⚠ Toxic (${percent}%)`
    : `⚠ Toxic (${percent}%)`;

};
*/


const API_URL = "http://127.0.0.1:5000/predict";

const input = document.getElementById("commentInput");
const button = document.getElementById("checkBtn");
const result = document.getElementById("result");

const toggle = document.getElementById("toggle");
const status = document.getElementById("status");

// Load toggle state
chrome.storage.sync.get(["enabled"], (data) => {
    const enabled = data.enabled ?? true;
    toggle.checked = enabled;
    updateStatus(enabled);
});

// Toggle change
toggle.addEventListener("change", () => {
    chrome.storage.sync.set({
        enabled: toggle.checked
    });
    updateStatus(toggle.checked);
});

// Update status text
function updateStatus(state) {
    status.textContent = state
        ? "Protection Enabled"
        : "Protection Disabled";
}

// MAIN BUTTON LOGIC
button.onclick = async () => {

    const text = input.value;
    if (!text) return;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ comment: text })
        });

        const data = await response.json();

        // Get highest score
        const score = Math.max(
            data.toxic,
            data.severe_toxic,
            data.obscene,
            data.threat,
            data.insult,
            data.identity_hate
        );

        const percent = (score * 100).toFixed(1);

        // Overall result
        let output = score > 0.5
            ? `⚠ <strong style="color:red;">Toxic (${percent}%)</strong><br><br>`
            : `✅ <strong style="color:green;">Non-Toxic (${percent}%)</strong><br><br>`;

        // Category breakdown
        output += `<u>Category Scores:</u><br>`;

        for (let key in data) {
            if (key !== "is_toxic") {

                const value = (data[key] * 100).toFixed(1);
                const color = value > 50 ? "red" : "white";

                output += `<span style="color:${color}">
                    ${key}: ${value}%
                </span><br>`;
            }
        }

        result.innerHTML = output;

    } catch (error) {
        result.innerHTML = `<span style="color:red;">Error connecting to backend</span>`;
    }
};