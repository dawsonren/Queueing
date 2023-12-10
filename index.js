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
    // turn input values into numbers
    for (const key of inputKeys) {
        inputs[key] = Number(inputs[key])
    }
    const outputs = CALCULATIONS[queueType](inputs)

    // stability
    const stability = outputs["stability"]
    const stabilityText = document.getElementById("stability-check-text")
    const stabilityCheckSignal = document.getElementById("stability-check-signal")
    if (stability) {
        stabilityText.innerHTML = "System is Stable"
        stabilityCheckSignal.style.backgroundColor = "#4DFF49"
    } else {
        stabilityText.innerHTML = "System is Unstable"
        stabilityCheckSignal.style.backgroundColor = "#FA5D41"
    }

    if (!stability) {
        // if unstable, clear outputs
        for (const key of outputKeys) {
            const output = document.getElementById(key)
            output.innerHTML = ""
        }
    } else {
        // render outputs
        for (const key of outputKeys) {
            const output = document.getElementById(key)
            output.innerHTML = outputs[key].toFixed(3)
        }
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
            inputItemUnits.classList.add("input-item-units")
            inputItemUnits.innerHTML = returnUnitText(units, timeUnit)
            inputItemUnits.id = `${key}_units`
            inputItemLabel.appendChild(inputItemUnits)
        }
        inputItemDiv.appendChild(inputItemLabel)

        // input and symbol
        const inputItemInputDiv = document.createElement("div")
        inputItemInputDiv.className = "input-item-input-div"
        const inputItemInput = document.createElement("input")
        inputItemInput.className = "input-item-input"
        inputItemInput.placeholder = `Enter ${name.toLowerCase()}...`
        inputItemInput.type = "number"
        inputItemInput.id = key
        const inputItemLine = document.createElement("div")
        inputItemLine.className = "input-item-line"
        const inputItemSymbol = document.createElement("p")
        katex.render(symbol, inputItemSymbol, {
            throwOnError: false
        });
        inputItemInputDiv.appendChild(inputItemSymbol)
        inputItemInputDiv.appendChild(inputItemLine)
        inputItemInputDiv.appendChild(inputItemInput)
        inputItemDiv.appendChild(inputItemInputDiv)

        inputDiv.appendChild(inputItemDiv)
    }
}

function renderOutputs(outputKeys) {
    const outputDiv = document.getElementById("output-items")
    const timeUnit = getTimeUnit()

    // clear inputDiv
    outputDiv.innerHTML = ""
    let outputRow = document.createElement("div")
    outputRow.className = "output-row" 

    for (const key of outputKeys) {
        // skip stability
        if (key === "stability") { continue }

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
            outputItemUnits.classList.add("output-item-units")
            outputItemUnits.innerHTML = returnUnitText(units, timeUnit)
            outputItemUnits.id = `${key}_units`
            outputItemLabel.appendChild(outputItemUnits)
        }
        outputItemDiv.appendChild(outputItemLabel)

        // input and symbol
        const outputItemOutputDiv = document.createElement("div")
        outputItemOutputDiv.className = "output-item-output-div"
        const outputItemValue = document.createElement("div")
        outputItemValue.className = "output-item-value"
        outputItemValue.id = key
        const outputItemLine = document.createElement("div")
        outputItemLine.className = "output-item-line"
        const outputItemSymbol = document.createElement("p")
        katex.render(symbol, outputItemSymbol, {
            throwOnError: false
        });
        outputItemOutputDiv.appendChild(outputItemSymbol)
        outputItemOutputDiv.appendChild(outputItemLine)
        outputItemOutputDiv.appendChild(outputItemValue)
        outputItemDiv.appendChild(outputItemOutputDiv)
        outputRow.appendChild(outputItemDiv)

        // put two items per row
        if (outputRow.childElementCount === 2) {
            outputDiv.appendChild(outputRow)
            outputRow = document.createElement("div")
            outputRow.className = "output-row"
        }

        // if last item, put it in
        if (key === outputKeys[outputKeys.length - 1]) {
            outputDiv.appendChild(outputRow)
        }
    }
}

function changeInputOutput() {
    const queueType = getQueueType()
    const [inputKeys, outputKeys] = QUEUE_TO_INPUT_OUTPUT_KEYS_MAP[queueType]

    renderInputs(inputKeys)
    renderOutputs(outputKeys)

    // reset error text
    const errorDiv = document.getElementById("input-error")
    errorDiv.innerHTML = ""

    // reset stability check
    const stabilityText = document.getElementById("stability-check-text")
    const stabilityCheckSignal = document.getElementById("stability-check-signal")
    stabilityText.innerHTML = "System Stability Unknown"
    stabilityCheckSignal.style.backgroundColor = "#F1F1F1"
}

function changeTimeUnit() {
    const timeUnit = getTimeUnit()

    document.querySelectorAll(".input-item-units").forEach((element) => {
        const key = element.id.split("_")[0]
        const {units} = INPUT_TO_RENDING_DATA_MAP[key]

        element.innerHTML = returnUnitText(units, timeUnit)
    })

    document.querySelectorAll(".output-item-units").forEach((element) => {
        const key = element.id.split("_")[0]
        const {units} = OUTPUT_TO_RENDING_DATA_MAP[key]

        element.innerHTML = returnUnitText(units, timeUnit)
    })
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
timeUnitSelect.addEventListener("change", changeTimeUnit)

// on submit, calculate
const submitButton = document.getElementById("input-submit");
submitButton.addEventListener("click", calculate)
