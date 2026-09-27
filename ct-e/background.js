const API_URL = "http://127.0.0.1:5000/predict";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.type === "toxicity_check") {

        fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({comment: request.text})
        })
        .then(res => res.json())
        .then(data => sendResponse(data))
        .catch(err => console.error(err));

        return true;
    }

});