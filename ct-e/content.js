function toggleBlur(element, score){

    let blurred = true;

    element.style.filter = "blur(6px)";
    element.style.cursor = "pointer";

    const label = document.createElement("div");

    label.innerText = `⚠ Toxic (${(score*100).toFixed(1)}%)`;

    label.style.color = "red";
    label.style.fontSize = "12px";

    element.parentNode.insertBefore(label, element);

    element.addEventListener("click", () => {

        blurred = !blurred;

        element.style.filter = blurred ? "blur(6px)" : "none";

    });

}

function analyzeComment(element){

    const text = element.innerText.trim();

    if(text.length < 5) return;

    chrome.runtime.sendMessage(
        {type:"toxicity_check", text:text},
        function(data){

            if(!data) return;

            const score = Math.max(
                data.toxic,
                data.insult,
                data.obscene,
                data.identity_hate
            );

            if(score > 0.5){
                toggleBlur(element, score);
            }

        }
    );

}

function scanPage(){

    const selectors = [

        "ytd-comment-renderer #content-text",
        "span[data-testid='tweetText']",
        "div[data-testid='comment']",
        "shreddit-comment",
        "span"

    ];

    selectors.forEach(selector => {

        document.querySelectorAll(selector).forEach(el => {

            if(!el.dataset.checked){

                el.dataset.checked = true;

                analyzeComment(el);

            }

        });

    });

}

scanPage();

const observer = new MutationObserver(scanPage);

observer.observe(document.body,{
    childList:true,
    subtree:true
});