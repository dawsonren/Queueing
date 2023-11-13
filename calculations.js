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
        "mean-time-in-queue": meanTimeInQueue,
        "stability": utilization < 1
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
        "mean-time-in-queue": meanTimeInQueue,
        "stability": utilization < 1
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
        "prob-cust-waits-more-than-t": probCustWaitsMoreThanT,
        "stability": utilization < 1
    }
}

function MMsc(inputs) {
    const utilization = inputs["arrival-rate"] / (inputs["service-rate"] * inputs["servers"])
    const offeredLoad = inputs["arrival-rate"] / inputs["service-rate"]
    let probEmptySys, probFullSys, effectiveArrivalRate, meanNumInQueue, meanTimeInQueue, meanTimeInSys, meanNumInSys, probCustWaits, probCustWaitsMoreThanT

    if (inputs["servers"] === inputs["capacity"]) {
        // the entire population can be in the system at the same time
        let invP0 = 1
        for (let i = 1; i <= inputs["capacity"]; i++) {
            invP0 += offeredLoad ** i / factorial(i)
        }
        probEmptySys = 1 / invP0
        probFullSys = probEmptySys * (offeredLoad ** inputs["capacity"] / factorial(inputs["capacity"]))
        effectiveArrivalRate = inputs["arrival-rate"] * (1 - probFullSys)
        meanNumInQueue = 0
        meanTimeInQueue = 0
        meanTimeInSys = meanTimeInQueue + (1 / inputs["service-rate"])
        meanNumInSys = meanTimeInSys * effectiveArrivalRate
        probCustWaits = 0
        probCustWaitsMoreThanT = 0
        
    } else if (inputs["servers"] == 1 && inputs["arrival-rate"] == inputs["service-rate"]) {
        // only one server and the arrival rate is equal to the service rate
        // this is unstable for infinite queue length but since there's a limited capacity, it's stable
        probEmptySys = 1 / (1 + inputs["capacity"])
        probFullSys = 1 / (1 + inputs["capacity"])
        effectiveArrivalRate = inputs["arrival-rate"] * (1 - probFullSys)
        meanNumInQueue = inputs["capacity"] * (inputs["capacity"] - 1) / (2 * inputs["capacity"] + 2)
        meanTimeInQueue = meanNumInQueue / effectiveArrivalRate
        meanTimeInSys = meanTimeInQueue + (1 / inputs["service-rate"])
        meanNumInSys = meanTimeInSys * effectiveArrivalRate
        probCustWaits = 1 - probEmptySys / (1 - probFullSys)

        let total = 0
        let exp = Math.exp(-1 * inputs["servers"] * inputs["service-rate"] * inputs["waiting-more-than-t"])
        for (let j = inputs["servers"]; j <= inputs["capacity"] - 1; j++) {
            let s2 = 0
            for (let i = 0; i <= j - inputs["servers"]; j++) {
                s2 += (inputs["servers"] * inputs["service-rate"] * inputs["waiting-more-than-t"]) ** i * exp / factorial(i)
            }
            let s1 = offeredLoad ** j / (factorial(inputs["servers"]) * inputs["servers"] ** (j - inputs["servers"]))
            total += s1 * s2
        }

        probCustWaitsMoreThanT = probEmptySys * total / (1 - probFullSys) 
    } else if (inputs["servers"] > 1 && inputs["arrival-rate"] == inputs["service-rate"] * inputs["servers"]) {
        // more than one server and the arrival rate is equal to the service rate times the number of servers
        // this is unstable for infinite populations but since there's a limited capacity, it's stable
        let invP0 = 0
        for (let i = 0; i <= inputs["servers"] - 1; i++) {
            invP0 += offeredLoad ** i / factorial(i)
        }
        invP0 += offeredLoad ** inputs["servers"] * (inputs["capacity"] - inputs["servers"] + 1) / factorial(inputs["servers"])
        probEmptySys = 1 / invP0
        probFullSys = probEmptySys * (offeredLoad ** inputs["capacity"] / factorial(inputs["servers"] * inputs["servers"] ** (inputs["capacity"] - inputs["servers"])))
        meanNumInQueue = 0

        for (let i = inputs["servers"] + 1; i <= inputs["capacity"]; i++) {
            let Ppn = offeredLoad ** i / (factorial(inputs["servers"]) * inputs["servers"] ** (i - inputs["servers"])) * probEmptySys
            meanNumInQueue += (i - inputs["servers"]) * Ppn
        }
        effectiveArrivalRate = inputs["arrival-rate"] * (1 - probFullSys)
        meanTimeInQueue = meanNumInQueue / effectiveArrivalRate
        meanTimeInSys = meanTimeInQueue + (1 / inputs["service-rate"])
        meanNumInSys = meanTimeInSys * effectiveArrivalRate

        let probCustDoesntWait = 1
        for (let i = 0; i <= inputs["servers"] - 1; i++) {
            probCustDoesntWait += offeredLoad ** i / factorial(i)
        }
        probCustDoesntWait += probEmptySys * probCustDoesntWait / (1 - probFullSys)
        probCustWaits = 1 - probCustDoesntWait

        let total = 0
        let exp = Math.exp(-1 * inputs["servers"] * inputs["service-rate"] * inputs["waiting-more-than-t"])
        for (let j = inputs["servers"]; j <= inputs["capacity"] - 1; j++) {
            let s2 = 0
            for (let i = 0; i <= j - inputs["servers"]; j++) {
                s2 += (inputs["servers"] * inputs["service-rate"] * inputs["waiting-more-than-t"]) ** i * exp / factorial(i)
            }
            let s1 = offeredLoad ** j / (factorial(inputs["servers"]) * inputs["servers"] ** (j - inputs["servers"]))
            total += s1 * s2
        }

        probCustWaitsMoreThanT = probEmptySys * total / (1 - probFullSys) 
    } else {
        let invP0 = 0
        let factor = 1
        for (let i = 0; i <= inputs["servers"]; i++) {
            factor *= offeredLoad / i
            invP0 += factor
        }
        if (inputs["servers"] < inputs["capacity"]) {
            let utilizationSum = utilization
            if (inputs["servers"] + 1 < inputs["capacity"]) {
                for (let i = inputs["servers"] + 2; i <= inputs["capacity"]; i++) {
                    utilizationSum += utilization ** (i - inputs["servers"])
                }
            }
            invP0 += factor * utilizationSum
        }
        probEmptySys = 1 / invP0
        probFullSys = probEmptySys * offeredLoad ** inputs["capacity"] / (factorial(inputs["servers"]) * inputs["servers"] ** (inputs["capacity"] - inputs["servers"]))
        effectiveArrivalRate = inputs["arrival-rate"] * (1 - probFullSys)
        // TODO: double check I entered this correctly
        meanNumInQueue = probEmptySys * offeredLoad ** inputs["servers"] / (factorial(inputs["servers"]) * (1 - utilization) ** 2 * (1 - utilization ** (inputs["capacity"] - inputs["servers"]) - (inputs["capacity"] - inputs["servers"] * utilization ** (inputs["capacity"] - inputs["servers"]) * (1 - utilization))))
        meanTimeInQueue = meanNumInQueue / effectiveArrivalRate
        meanTimeInSys = meanTimeInQueue + (1 / inputs["service-rate"])
        meanNumInSys = meanTimeInSys * effectiveArrivalRate

        let probCustDoesntWait = 1
        for (let i = 0; i <= inputs["servers"] - 1; i++) {
            probCustDoesntWait += offeredLoad ** i / factorial(i)
        }
        probCustDoesntWait += probEmptySys * probCustDoesntWait / (1 - probFullSys)
        probCustWaits = 1 - probCustDoesntWait

        let total = 0
        let exp = Math.exp(-1 * inputs["servers"] * inputs["service-rate"] * inputs["waiting-more-than-t"])
        for (let j = inputs["servers"]; j <= inputs["capacity"] - 1; j++) {
            let s2 = 0
            for (let i = 0; i <= j - inputs["servers"]; j++) {
                s2 += (inputs["servers"] * inputs["service-rate"] * inputs["waiting-more-than-t"]) ** i * exp / factorial(i)
            }
            let s1 = offeredLoad ** j / (factorial(inputs["servers"]) * inputs["servers"] ** (j - inputs["servers"]))
            total += s1 * s2
        }

        probCustWaitsMoreThanT = probEmptySys * total / (1 - probFullSys) 
    }


    return {
        "utilization": utilization,
        "prob-empty-sys": probEmptySys,
        "mean-num-in-sys": meanNumInSys,
        "mean-num-in-queue": meanNumInQueue,
        "mean-time-in-sys": meanTimeInSys,
        "mean-time-in-queue": meanTimeInQueue,
        "prob-cust-waits": probCustWaits,
        "prob-cust-waits-more-than-t": probCustWaitsMoreThanT,
        "effective-arrival-rate": effectiveArrivalRate,
        "stability": utilization <= 1
    }
}

function MMsNN(inputs) {
    const offeredLoad = inputs["arrival-rate"] / inputs["service-rate"]
    const Pi = new Array(inputs["calling-population"]).fill(0)
    let invP0 = 0
    if (inputs["servers"] > 1) {
        for (let i = 1; i <= inputs["servers"] - 1; i++) {
            let val = factorial(inputs["calling-population"]) / (factorial(i) * factorial(inputs["calling-population"] - i)) * offeredLoad ** i
            Pi[i - 1] = val
            invP0 += val
        }
    }

    for (let i = inputs["servers"]; i <= inputs["calling-population"]; i++) {
        let val = factorial(inputs["calling-population"] - i) / (factorial(inputs["servers"]) * (inputs["servers"] ** (i - inputs["servers"]))) * offeredLoad ** i
        Pi[i - 1] = val
        invP0 += val
    }

    probEmptySys = 1 / invP0
    meanNumInSys = 0
    meanNumInQueue = 0
    effectiveArrivalRate = inputs["calling-population"] * inputs["arrival-rate"] * probEmptySys
    for (let i = 1; i <= inputs["calling-population"]; i++) {
        P[i - 1] = Pi[i - 1] * probEmptySys
        meanNumInSys += i * Pi[i - 1]
        meanNumInQueue += Math.max(0, i - inputs["servers"]) * Pi[i - 1]
        effectiveArrivalRate += inputs["arrival-rate"] * (inputs["calling-population"] - i) * Pi[i - 1]
    }
    meanTimeInSys = meanNumInSys / effectiveArrivalRate
    meanTimeInQueue = meanNumInQueue / effectiveArrivalRate
    utilization = effectiveArrivalRate / (inputs["service-rate"] * inputs["servers"])

    return {
        "utilization": utilization,
        "prob-empty-sys": probEmptySys,
        "mean-num-in-sys": meanNumInSys,
        "mean-num-in-queue": meanNumInQueue,
        "mean-time-in-sys": meanTimeInSys,
        "mean-time-in-queue": meanTimeInQueue,
        "effective-arrival-rate": effectiveArrivalRate,
        "stability": utilization <= 1
    }
}

function GG1b(inputs) {
    const customerArrivalRate = 1 / inputs["mean-interarrival"]
    const cv2Process = inputs["standard-deviation-processing"] ** 2 / inputs["mean-processing"] ** 2
    const breakdownProportion = inputs["breakdown"] / (inputs["breakdown"] + inputs["fix"])
    const meanEffectiveProcessingTime = inputs["mean-processing"] / breakdownProportion
    const cv2Outage = inputs["fix"] === 0 ? 0 : inputs["standard-deviation-fix"] ** 2 / inputs["fix"] ** 2
    const cv2EffectiveProcess = cv2Process + (1 + cv2Outage) * breakdownProportion * (1 - breakdownProportion) * (inputs["mean-fix"] / inputs["mean-processing-time"])
    const cv2CustomerInterarrival = inputs["standard-deviation-interarrival"] ** 2 / customerArrivalRate ** 2

    const V = (cv2EffectiveProcess + cv2CustomerInterarrival) / 2
    const u1 = customerArrivalRate * meanEffectiveProcessingTime
    const u2 = 1 / u1
    const WIPnb1 = V * (u1 ** 2 / (1 - u1)) + u1
    const WIPnb2 = V * (u2 ** 2 / (1 - u2)) + u2
    const rho = (WIPnb1 - u1) / WIPnb1
    const TH1 = customerArrivalRate * (1 - u1 * rho ** capacity) / (1 - (u1 ** 2) * rho ** capacity)
    const rho_R = (WIPnb2 - u2) / WIPnb2
    const rho_2 = 1 / rho_R
    const TH2 = customerArrivalRate * (1 - u1 * rho_2 ** capacity) / (1 - (u1 ** 2) * rho_2 ** capacity)
    const TH3 = customerArrivalRate * (cv2CustomerInterarrival + cv2EffectiveProcess + 2 * inputs["capacity"]) / (2 * (cv2EffectiveProcess + cv2CustomerInterarrival + inputs["capacity"]))
    const throughput = u1 < 1 ? TH1 : (u1 > 1 ? TH2 : TH3)
    const probFullSys = 1 - throughput / customerArrivalRate

    return {
        "throughput": throughput,
        "prob-full-sys": probFullSys,
        "stability": meanEffectiveProcessingTime < inputs["mean-interarrival"]
    }
}

function GGc(inputs) {
    const customerArrivalRate = 1 / inputs["mean-interarrival"]
    const serverAvailability = inputs["breakdown"] / (inputs["breakdown"] + inputs["fix"])
    const cv2Process = inputs["standard-deviation-processing"] ** 2 / inputs["mean-processing"] ** 2
    const meanEffectiveProcessingTime = inputs["mean-processing"] / serverAvailability
    const cv2Outage = inputs["fix"] === 0 ? 0 : inputs["standard-deviation-fix"] ** 2 / inputs["fix"] ** 2
    const cv2EffectiveProcess = cv2Process + (1 + cv2Outage) * serverAvailability * (1 - serverAvailability) * (inputs["mean-fix"] / inputs["mean-processing-time"])
    const cv2CustomerInterarrival = inputs["standard-deviation-interarrival"] ** 2 / customerArrivalRate ** 2
    const capacityUtilization = customerArrivalRate * meanEffectiveProcessingTime / inputs["servers"]
    const V = (cv2EffectiveProcess + cv2CustomerInterarrival) / 2
    const U = (1 / (inputs["servers"] * (1 - capacityUtilization))) * (capacityUtilization ** (2 * (inputs["servers"] + 1)) ** 0.5 - 1)
    const T = meanEffectiveProcessingTime

    const meanTimeInQueue = V * U * T
    const meanNuminQueue = meanTimeInQueue * customerArrivalRate
    const meanTimeInSys = meanTimeInQueue + T
    const meanNumInSys = meanTimeInSys * customerArrivalRate
    const cv2Interdeparture = 1 + (1 - capacityUtilization ** 2) * (cv2CustomerInterarrival - 1) + (capacityUtilization ** 2 / (inputs["servers"] ** 0.5)) * (cv2EffectiveProcess - 1)
    const meanInterdeparture = 1 / customerArrivalRate
    const stdDevInterdeparture = meanInterdeparture * cv2Interdeparture ** 0.5

    return {
        "utilization": capacityUtilization,
        "mean-num-in-sys": meanNumInSys,
        "mean-num-in-queue": meanNuminQueue,
        "mean-time-in-sys": meanTimeInSys,
        "mean-time-in-queue": meanTimeInQueue,
        "mean-interdeparture": meanInterdeparture,
        "standard-deviation-interdeparture": stdDevInterdeparture,
        "stability": capacityUtilization < 1
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