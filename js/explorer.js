
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
            
            /* Improved select styles for model and prompt selection */
            #modelSelect,
            #promptSelect {
                padding: 10px;
                font-size: 14px;
                color: #333;
                background-color: #f0f0f0;
                border: 2px solid #ccc;
                border-radius: 5px;
                width: auto;
                max-width: 100%;
                transition: all 0.3s ease;
            }

            #modelSelect:hover,
            #promptSelect:hover {
                background-color: #e0e0e0;
                border-color: #888;
            }

            #modelSelect:focus,
            #promptSelect:focus {
                border-color: #666;
                outline: none;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
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

            function createResponseItem(labelText, contentText) {
                // Inject styles only if they haven't been added before
                if (!document.getElementById('response-style')) {
                    const style = document.createElement('style');
                    style.id = 'response-style';
                    style.textContent = `
                        .response-container {
                            display: flex;
                            gap: 20px;
                            margin-bottom: 10px;
                        }
                        .response-label-container {
                            flex: 0 0 100px;
                            padding: 10px;
                            
                        }
                        .response-content-container {
                            flex: 1;
                            max-height: 500px;
                            overflow-y: auto;
                            padding: 10px;
           
                        }
                        .response-label {
                            font-weight: bold;
                            display: block;
                        }
                        .response-text {
                            display: block;
                        }
                    `;
                    document.head.appendChild(style);
                }
            
                // Create the container for both items
                const container = document.createElement('div');
                container.className = 'response-container';
            
                // Create the label container
                const labelContainer = document.createElement('div');
                labelContainer.className = 'response-label-container';
                const label = document.createElement('div');
                label.className = 'response-label';
                label.textContent = labelText;
                labelContainer.appendChild(label);
            
                // Create the content container
                const contentContainer = document.createElement('div');
                contentContainer.className = 'response-content-container';
            
                // Ensure contentText is a string to avoid TypeError
                const text = (contentText !== undefined && contentText !== null) ? String(contentText) : '';
            
                // Process text to handle line breaks and bold formatting
                const formattedContent = text
                    .replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
            
                // Create and append content with formatted HTML
                const content = document.createElement('div');
                content.className = 'response-text';
                content.innerHTML = formattedContent;
                contentContainer.appendChild(content);
            
                // Append both containers to the main container
                container.appendChild(labelContainer);
                container.appendChild(contentContainer);
            
                return container;
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




    