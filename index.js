// import fonts so we don't have to get it from Google Fonts CDN
import '@fontsource/oswald/200.css'
import '@fontsource/oswald/400.css'
import { QUEUE_TO_INPUT_OUTPUT_KEYS_MAP, INPUT_TO_RENDING_DATA_MAP, OUTPUT_TO_RENDING_DATA_MAP } from './constants';
import { CALCULATIONS } from './calculations';

function showError(errorText = false) {
    const errorDiv = document.getElementById("input-error")
    errorDiv.innerHTML = errorText || "Please enter valid inputs."
}

function errorText(key, value) {
    const {name} = INPUT_TO_RENDING_DATA_MAP[key]

    if (value === "") {
        return `Please enter a ${name.toLowerCase()}.`
    } else if (value < 0) {
        return `Please enter a non-negative ${name.toLowerCase()}.`
    }
}

/* UI Changes */
function calculate() {
    // reset error text
    const errorDiv = document.getElementById("input-error")
    errorDiv.innerHTML = ""

    const queueType = getQueueType()
    const [inputKeys, outputKeys] = QUEUE_TO_INPUT_OUTPUT_KEYS_MAP[queueType]

    // get input values
    let inputs = {}

    for (const key of inputKeys) {
        const input = document.getElementById(key)

        // check for when NaN or empty
        if (input.value === "" || input.value < 0) {
            showError(errorText(key, input.value))
            renderOutputs(outputKeys)
            return
        }

        inputs[key] = input.value
    }

    // calculate outputs
    const outputs = CALCULATIONS[queueType](inputs)

    // render outputs
    for (const key of outputKeys) {
        const output = document.getElementById(key)
        output.innerHTML = outputs[key]
    }
}

function getTimeUnit() {
    return document.getElementById("time-unit").value
}

function getQueueType() {
    return document.getElementById("queue-type").value
}

function returnUnitText(units, timeUnit) {
    if (units === "time") {
        return `(${timeUnit}s)`
    } else if (units === "rate") {
        return `(customers per ${timeUnit})`
    }
}

function generateTooltip(text, tooltipText) {
    const wrapper = document.createElement('div')
    wrapper.classList.add('tooltip')

    const content = document.createElement('span')
    content.classList.add('tooltip-highlight')
    content.appendChild(document.createTextNode(text))

    const tooltip = document.createElement('span')
    tooltip.classList.add('tooltip-text-above')
    tooltip.appendChild(document.createTextNode(tooltipText))

    wrapper.appendChild(content)
    wrapper.appendChild(tooltip)

    return wrapper
}

function renderInputs(inputKeys) {
    const inputDiv = document.getElementById("input-items")
    const timeUnit = getTimeUnit()

    // clear inputDiv
    inputDiv.innerHTML = ""

    for (const key of inputKeys) {
        // units is false if not specified
        const {name, symbol, description, units = false} = INPUT_TO_RENDING_DATA_MAP[key]

        // name and units
        const inputItemDiv = document.createElement("div")
        inputItemDiv.className = "input-item-div"
        const inputItemLabel = document.createElement("div")
        inputItemLabel.className = "input-item-label"
        const inputItemName = generateTooltip(name, description)
        inputItemLabel.appendChild(inputItemName)
        if (units) {
            const inputItemUnits = document.createElement("p")
            inputItemUnits.className = "units"
            inputItemUnits.innerHTML = returnUnitText(units, timeUnit)
            inputItemLabel.appendChild(inputItemUnits)
        }
        inputItemDiv.appendChild(inputItemLabel)

        // input and symbol
        const inputItemInput = document.createElement("input")
        inputItemInput.className = "input-item-input"
        inputItemInput.placeholder = `Enter ${name.toLowerCase()}...`
        inputItemInput.type = "number"
        inputItemInput.id = key
        const inputItemSymbol = document.createElement("p")
        katex.render(symbol, inputItemSymbol, {
            throwOnError: false
        });
        inputItemDiv.appendChild(inputItemSymbol)
        inputItemDiv.appendChild(inputItemInput)

        inputDiv.appendChild(inputItemDiv)
    }
}

function renderOutputs(outputKeys) {
    const outputDiv = document.getElementById("output-items")
    const timeUnit = getTimeUnit()

    // clear inputDiv
    outputDiv.innerHTML = ""

    for (const key of outputKeys) {
        // units is false if not specified
        const {name, symbol, description, units = false} = OUTPUT_TO_RENDING_DATA_MAP[key]

        // name and units
        const outputItemDiv = document.createElement("div")
        outputItemDiv.className = "output-item-div"
        const outputItemLabel = document.createElement("div")
        outputItemLabel.className = "output-item-label"
        const outputItemName = generateTooltip(name, description)
        outputItemLabel.appendChild(outputItemName)
        if (units) {
            const outputItemUnits = document.createElement("p")
            outputItemUnits.className = "units"
            outputItemUnits.innerHTML = returnUnitText(units, timeUnit)
            outputItemLabel.appendChild(outputItemUnits)
        }
        outputItemDiv.appendChild(outputItemLabel)

        // input and symbol
        const outputItemValue = document.createElement("div")
        outputItemValue.className = "output-item-value"
        outputItemValue.id = key
        const outputItemSymbol = document.createElement("p")
        katex.render(symbol, outputItemSymbol, {
            throwOnError: false
        });
        outputItemDiv.appendChild(outputItemSymbol)
        outputItemDiv.appendChild(outputItemValue)

        outputDiv.appendChild(outputItemDiv)
    }   
}

function changeInputOutput() {
    const queueType = getQueueType()
    const [inputKeys, outputKeys] = QUEUE_TO_INPUT_OUTPUT_KEYS_MAP[queueType]

    renderInputs(inputKeys)
    renderOutputs(outputKeys)
}

// on load, render inputs and outputs
window.onload = function() {
    changeInputOutput()
}

// on queue-type change, change inputs and outputs
const queueTypeSelect = document.getElementById("queue-type")
queueTypeSelect.addEventListener("change", changeInputOutput)

// on time-unit change, change inputs and outputs
const timeUnitSelect = document.getElementById("time-unit")
timeUnitSelect.addEventListener("change", changeInputOutput)

// on submit, calculate
const submitButton = document.getElementById("input-submit");
submitButton.addEventListener("click", calculate)
