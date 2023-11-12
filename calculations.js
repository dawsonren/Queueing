/*
Defines all calculations for various queues for the website.
*/

function factorial(num) {
    var rval = 1;
    for (var i = 2; i <= num; i++)
        rval = rval * i;
    return rval;
}

function MG1(inputs) {
    const utilization = inputs["arrival-rate"] / inputs["service-rate"]
    const probEmptySys = 1 - utilization
    const meanNumInSys = utilization + (utilization ** 2 * (1 + inputs["variance"] * inputs["service-rate"] ** 2)) / (2 * (1 - utilization))
    const meanTimeInSys = meanNumInSys / inputs["arrival-rate"]
    const meanTimeInQueue = meanTimeInSys - (1 / inputs["service-rate"])
    const meanNumInQueue = meanTimeInQueue * inputs["arrival-rate"]

    return {
        "utilization": utilization,
        "prob-empty-sys": probEmptySys,
        "mean-num-in-sys": meanNumInSys,
        "mean-num-in-queue": meanNumInQueue,
        "mean-time-in-sys": meanTimeInSys,
        "mean-time-in-queue": meanTimeInQueue
    }
}

function MGs(inputs) {
    const CV2 = inputs["variance"] * inputs["service-rate"] ** 2
    const utilization = inputs["arrival-rate"] / (inputs["service-rate"] * inputs["servers"])
    const offeredLoad = inputs["arrival-rate"] / inputs["service-rate"]
    let factor = 1
    let invP0 = 1

    for (let i = 1; i <= inputs["servers"] - 1; i++) {
        factor *= offeredLoad / i
        invP0 += factor
    }
    invP0 += factor * offeredLoad / (c * (1 - utilization))
    const probEmptySys = 1 / invP0

    const serversFactorial = factorial(inputs["servers"])
    const meanNumInQueue = (offeredLoad ** (inputs["servers"] + 1) * probEmptySys) / (inputs["servers"] * serversFactorial * (1 - utilization) ** 2 * (1 - CV2) * 2)
    const meanTimeInQueue = meanNumInQueue / inputs["arrival-rate"]
    const meanTimeInSys = meanTimeInQueue + (1 / inputs["service-rate"])
    const meanNumInSys = meanTimeInSys * inputs["arrival-rate"]

    return {
        "utilization": utilization,
        "prob-empty-sys": probEmptySys,
        "mean-num-in-sys": meanNumInSys,
        "mean-num-in-queue": meanNumInQueue,
        "mean-time-in-sys": meanTimeInSys,
        "mean-time-in-queue": meanTimeInQueue
    }
}

function MMs(inputs) {
    const utilization = inputs["arrival-rate"] / (inputs["service-rate"] * inputs["servers"])
    const offeredLoad = inputs["arrival-rate"] / inputs["service-rate"]
    let factor = 1
    let invP0 = 1

    for (let i = 1; i <= inputs["servers"] - 1; i++) {
        factor *= offeredLoad / i
        invP0 += factor
    }
    invP0 += factor * offeredLoad / (inputs["servers"] * (1 - utilization))
    const probEmptySys = 1 / invP0

    const serversFactorial = factorial(inputs["servers"])
    const meanNumInSys = offeredLoad + (offeredLoad ** (inputs["servers"] + 1) * probEmptySys) / (inputs["servers"] * serversFactorial * (1 - utilization) ** 2)
    const meanTimeInSys = meanNumInSys / inputs["arrival-rate"]
    const meanTimeInQueue = meanTimeInSys - (1 / inputs["service-rate"])
    const meanNumInQueue = meanTimeInQueue * inputs["arrival-rate"]
    const probCustWaits = offeredLoad ** inputs["servers"] * probEmptySys * (inputs["servers"] * inputs["service-rate"] / (inputs["servers"] * inputs["service-rate"] - inputs["arrival-rate"])) / serversFactorial
    const probCustWaitsMoreThanT = probCustWaits * Math.exp((inputs["arrival-rate"] - inputs["service-rate"] * inputs["servers"]) * inputs["waiting-more-than-t"])

    return {
        "utilization": utilization,
        "prob-empty-sys": probEmptySys,
        "mean-num-in-sys": meanNumInSys,
        "mean-num-in-queue": meanNumInQueue,
        "mean-time-in-sys": meanTimeInSys,
        "mean-time-in-queue": meanTimeInQueue,
        "prob-cust-waits": probCustWaits,
        "prob-cust-waits-more-than-t": probCustWaitsMoreThanT
    }
}

function MMsc(inputs) {
    const utilization = inputs["arrival-rate"] / (inputs["service-rate"] * inputs["servers"])
    const offeredLoad = inputs["arrival-rate"] / inputs["service-rate"]

    if (inputs["servers"] === inputs["capacity"]) {
        let P0 = 1
        for (let i = 1; i <= inputs["capacity"] - 1; i++) {
            P0 += offeredLoad ** i / factorial(i)
        }
        const serversFactorial = factorial(inputs["servers"])

    }

    return {
        "utilization": 0,
        "prob-empty-sys": 0,
        "mean-num-in-sys": 0,
        "mean-num-in-queue": 0,
        "mean-time-in-sys": 0,
        "mean-time-in-queue": 0,
        "prob-cust-waits": 0,
        "prob-cust-waits-more-than-t": 0,
        "effective-arrival-rate": 0
    }
}

function MMsNN(inputs) {
    return {
        "utilization": 0,
        "prob-empty-sys": 0,
        "mean-num-in-sys": 0,
        "mean-num-in-queue": 0,
        "mean-time-in-sys": 0,
        "mean-time-in-queue": 0,
        "effective-arrival-rate": 0
    }
}

function GG1b(inputs) {
    return {
        "throughput": 0,
        "prob-full-sys": 0
    }
}

function GGc(inputs) {
    return {
        "utilization": 0,
        "prob-empty-sys": 0,
        "mean-num-in-sys": 0,
        "mean-num-in-queue": 0,
        "mean-time-in-sys": 0,
        "mean-time-in-queue": 0,
        "mean-interdeparture": 0,
        "standard-deviation-interdeparture": 0
    }
}

export const CALCULATIONS = {
    "MG1": MG1,
    "MGs": MGs,
    "MMs": MMs,
    "MMsc": MMsc,
    "MMsNN": MMsNN,
    "GG1b": GG1b,
    "GGc": GGc
}