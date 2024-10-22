const PromptSelector = (function() {

    function displayPromptDetails(promptData, container) {
        container.innerHTML = ''; // Clear previous content

        // Create a wrapper for prompt details
        const promptDetailsContent = document.createElement('div');
        promptDetailsContent.className = 'prompt-details-content';

        // Function to create prompt items
        function createPromptItem(titleText, contentText, isToggleable) {
            const item = document.createElement('div');
            item.className = 'prompt-item';

            if (isToggleable) {
                // Create the collapse-toggle div
                const collapseToggle = document.createElement('div');
                collapseToggle.className = 'collapse-toggle';
                collapseToggle.setAttribute('tabindex', '0');
                collapseToggle.setAttribute('role', 'button');
                collapseToggle.setAttribute('aria-expanded', 'true');
                collapseToggle.style.marginTop = '5px';

                const titleContainer = document.createElement('div');
                titleContainer.style.display = 'inline-flex';
                titleContainer.style.alignItems = 'center';

                const title = document.createElement('div');
                title.className = 'prompt-item-title';
                title.textContent = titleText;

                const triangle = document.createElement('div');
                triangle.className = 'triangle';

                // Append title and triangle to titleContainer
                titleContainer.appendChild(title);
                titleContainer.appendChild(triangle);

                collapseToggle.appendChild(titleContainer);

                item.appendChild(collapseToggle);

                // Event listener for collapseToggle
                collapseToggle.addEventListener('click', function() {
                    const contentDiv = item.querySelector('.prompt-item-content');
                    contentDiv.classList.toggle('hidden');
                    const expanded = !contentDiv.classList.contains('hidden');
                    collapseToggle.setAttribute('aria-expanded', expanded);
                    triangle.classList.toggle('collapsed', !expanded);
                });

                const content = document.createElement('div');
                content.className = 'prompt-item-content';
                content.innerHTML = contentText;

                content.classList.add('hidden');

                item.appendChild(content);

            } else {
                const contentContainer = document.createElement('div');
                contentContainer.className = 'prompt-item-content-inline';

                const title = document.createElement('span');
                title.className = 'prompt-item-title';
                title.textContent = titleText;

                const content = document.createElement('span');
                content.className = 'prompt-item-text';
                content.innerHTML = contentText;

                contentContainer.appendChild(title);
                contentContainer.appendChild(content);
                item.appendChild(contentContainer);
            }

            return item;
        }

        // Create and append prompt items to the wrapper in the new order
        promptDetailsContent.appendChild(createPromptItem('Abstract Problem: ', promptData.abstractProblem, false));
        promptDetailsContent.appendChild(createPromptItem('Quiz: ', promptData.quiz, false));
        promptDetailsContent.appendChild(createPromptItem('Prompt: ', promptData.prompt, true));
        promptDetailsContent.appendChild(createPromptItem('Solution: ', promptData.groundTruth, false));
        promptDetailsContent.appendChild(createPromptItem('Synthetic CoT: ', promptData.syntheticCoT.replace(/\n/g, '<br>'), true));

        container.appendChild(promptDetailsContent);
    }

    function applyStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .prompt-selector-container {
                width: 100%;
                margin: 0;
                padding: 20px;
                box-sizing: border-box;
                font-family: Arial, sans-serif;
            }
            h2 {
                color: #333;
                margin-top: 0;
                font-size: 18px;
            }
            .form-group {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            }
            .form-group label {
                font-weight: bold;
                font-size: 14px;
                margin-right: 10px;
            }
            .form-group select {
                width: auto;
                padding: 5px;
                font-size: 14px;
            }
            #promptDetails {
                margin-top: 20px;
                max-height: 400px;
                overflow: auto;
            }
            #responseContainer {
                margin-top: 20px;
            }
            .prompt-details-content {
                background-color: #FFF3E0;
                padding: 15px;
                margin-bottom: 15px;
                border-radius: 4px;
                box-sizing: border-box;
                border: 1px solid #ddd;
            }
            .prompt-item {
                margin-bottom: 10px;
            }
            .prompt-item:last-child {
                margin-bottom: 0;
            }
            .response {
                background-color: #f9f9f9;
                padding: 15px;
                margin-bottom: 15px;
                border-radius: 4px;
                box-sizing: border-box;
                border: 1px solid #ddd;
                font-size: 14px;
            }
            .hidden {
                display: none;
            }
            .collapse-toggle {
                display: flex;
                align-items: center;
                cursor: pointer;
                margin-bottom: 5px;
            }
            .prompt-item-title {
                margin-right: 5px;
                font-weight: bold;
                font-size: 14px;
            }
            .prompt-item-text {
                font-size: 14px;
            }
            .prompt-item-content {
                padding-left: 15px;
                font-size: 14px;
            }
            .triangle {
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-top: 7px solid #333;
                transition: transform 0.2s ease;
            }
            .triangle.collapsed {
                transform: rotate(-90deg);
            }
            .prompt-item-header {
                margin-bottom: 5px;
            }
            .prompt-item-content-inline {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
            }
            .response-label {
                color: purple;
            }
            .response-content {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                margin-bottom: 5px;
            }
            .response-content .response-label {
                margin-right: 5px;
            }
        `;
        document.head.appendChild(style);
    }

    function init(containerId) {
        applyStyles();

        const container = document.getElementById(containerId);
        container.className = 'prompt-selector-container';

        // Create the HTML structure
        container.innerHTML = `
            <div class="form-group">
                <label for="promptSelect">Select a data point:</label>
                <select id="promptSelect"></select>
            </div>
            <div id="promptDetails"></div>
            <div class="form-group">
                <label for="modelSelect">Select to see the LLM's response:</label>
                <select id="modelSelect"></select>
            </div>
            <div id="responseContainer"></div>
        `;

        const promptSelect = document.getElementById('promptSelect');
        const modelSelect = document.getElementById('modelSelect');
        const promptDetails = document.getElementById('promptDetails');
        const responseContainer = document.getElementById('responseContainer');

        // Populate the prompt dropdown
        promptList.forEach(prompt => {
            const option = document.createElement('option');
            option.value = prompt.value;
            option.textContent = prompt.text;
            promptSelect.appendChild(option);
        });

        // Populate the model dropdown
        // Add default "Select a model" option
        const defaultModelOption = document.createElement('option');
        defaultModelOption.value = '';
        defaultModelOption.textContent = 'Select a model';
        modelSelect.appendChild(defaultModelOption);

        modelList.forEach(model => {
            const option = document.createElement('option');
            option.value = model.value;
            option.textContent = model.text;
            modelSelect.appendChild(option);
        });

        promptSelect.addEventListener('change', () => {
            const selectedPrompt = promptSelect.value;
            if (selectedPrompt) {
                displayPromptDetails(prompts[selectedPrompt], promptDetails);
                // Clear the model selection and response when prompt changes
                modelSelect.value = '';
                responseContainer.innerHTML = '';
            } else {
                promptDetails.innerHTML = '';
                responseContainer.innerHTML = '';
            }
        });

        modelSelect.addEventListener('change', () => {
            const selectedPrompt = promptSelect.value;
            const selectedModel = modelSelect.value;

            if (!selectedPrompt || !selectedModel) {
                responseContainer.innerHTML = '';
                return;
            }

            responseContainer.innerHTML = '';

            const modelData = responses[selectedPrompt][selectedModel];

            const responseElement = document.createElement('div');
            responseElement.classList.add('response');

            // Create response content
            function createResponseItem(labelText, contentText) {
                const item = document.createElement('div');
                item.className = 'response-content';

                const label = document.createElement('span');
                label.className = 'response-label';
                label.textContent = labelText;

                const content = document.createElement('span');
                content.textContent = contentText;

                item.appendChild(label);
                item.appendChild(content);

                return item;
            }

            responseElement.appendChild(createResponseItem('Response: ', modelData.response));
            responseElement.appendChild(createResponseItem('Parsed Answer: ', modelData.parsedResult));
            responseElement.appendChild(createResponseItem('Correct: ', modelData.isCorrect));

            responseContainer.appendChild(responseElement);
        });

        // Set default prompt to the first in the list and display it
        promptSelect.value = promptList[0].value;
        promptSelect.dispatchEvent(new Event('change'));
    }

    return {
        init: init
    };
})();




    