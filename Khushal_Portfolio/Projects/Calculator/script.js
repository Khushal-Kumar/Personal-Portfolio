let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('.button'); // Corrected selector
let historyList = document.getElementById('historyList');
let clearHistoryBtn = document.getElementById('clearHistoryBtn');

let string = "";
let arr = Array.from(buttons);

// Load history from LocalStorage on page load
let historyData = JSON.parse(localStorage.getItem('calcHistory')) || [];
renderHistory();

arr.forEach(button => {
    button.addEventListener('click', (e) => {
        const btnValue = e.target.innerHTML;

        if (btnValue == '=') {
            try {
                if (string === "") return;

                // Save original expression for history
                let originalExpression = string;

                // Format expression for calculation (Handle %)
                let evalString = string.replace(/%/g, '/100');

                // Evaluate
                let result = eval(evalString);

                // Check for errors
                if (isNaN(result) || !isFinite(result)) {
                    input.value = "Error";
                    string = "";
                } else {
                    input.value = result;
                    string = result.toString();
                    
                    // Add to History
                    addToHistory(originalExpression, result);
                }
            } catch (error) {
                input.value = "Error";
                string = "";
            }
        } 
        else if (btnValue == 'AC') {
            string = "";
            input.value = string;
        } 
        else if (btnValue == 'DEL') {
            if(input.value === "Error") {
                string = "";
            } else {
                string = string.toString().slice(0, -1);
            }
            input.value = string;
        } 
        else {
            if(input.value === "Error") string = "";

            // Prevent starting with operators (except -)
            const operators = ['+', '-', '*', '/', '%', '.'];
            if (string === "" && operators.includes(btnValue) && btnValue !== '-') return;

            // Prevent double operators
            const lastChar = string.toString().slice(-1);
            if (operators.includes(lastChar) && operators.includes(btnValue)) {
                 string = string.slice(0, -1) + btnValue;
            } else {
                 string += btnValue;
            }
            input.value = string;
        }
    });
});

// --- History Functions ---

function addToHistory(expression, result) {
    const historyItem = { expr: expression, res: result };
    historyData.unshift(historyItem); // Add to beginning of array
    
    // Limit history to last 20 items
    if (historyData.length > 20) historyData.pop();

    localStorage.setItem('calcHistory', JSON.stringify(historyData));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = "";
    
    if (historyData.length === 0) {
        historyList.innerHTML = '<p class="empty-msg">No history yet</p>';
        return;
    }

    historyData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `${item.expr} <span>= ${item.res}</span>`;
        
        // Feature: Click history item to reuse result
        div.addEventListener('click', () => {
            string = item.res.toString();
            input.value = string;
        });

        historyList.appendChild(div);
    });
}

clearHistoryBtn.addEventListener('click', () => {
    historyData = [];
    localStorage.removeItem('calcHistory');
    renderHistory();
});