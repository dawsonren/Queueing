/*
Defines all calculations for various queues for the website.
*/

import { cumulativeStdNormalProbability } from "simple-statistics";

function factorial(num) {
    var rval = 1;
    for (var i = 2; i <= num; i++)
        rval = rval * i;
    return rval;
}

function standardNormalPDF(x) {
    return Math.exp(-(x ** 2) / 2) / Math.sqrt(2 * Math.PI)
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
    invP0 += factor * offeredLoad / (inputs["servers"] * (1 - utilization))
    const probEmptySys = 1 / invP0

    const serversFactorial = factorial(inputs["servers"])
    const meanNumInQueue = (offeredLoad ** (inputs["servers"] + 1) * probEmptySys) / (inputs["servers"] * serversFactorial * (1 - utilization) ** 2) * (1 + CV2) / 2
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

        let total = 0
        let exp = Math.exp(-1 * inputs["servers"] * inputs["service-rate"] * inputs["waiting-more-than-t"])
        for (let j = inputs["servers"]; j <= inputs["capacity"] - 1; j++) {
            let s2 = 0
            for (let i = 0; i <= j - inputs["servers"]; i++) {
                s2 += (inputs["servers"] * inputs["service-rate"] * inputs["waiting-more-than-t"]) ** i * exp / factorial(i)
            }
            let s1 = offeredLoad ** j / (factorial(inputs["servers"]) * inputs["servers"] ** (j - inputs["servers"]))
            total += s1 * s2
        }
    } else if (inputs["servers"] > 1 && (inputs["arrival-rate"] === inputs["service-rate"] * inputs["servers"])) {
        // more than one server and the arrival rate is equal to the service rate times the number of servers
        // this is unstable for infinite populations but since there's a limited capacity, it's stable
        let invP0 = 1
        for (let i = 0; i <= inputs["servers"] - 1; i++) {
            invP0 += offeredLoad ** i / factorial(i)
        }
        invP0 += offeredLoad ** inputs["servers"] * (inputs["capacity"] - inputs["servers"] + 1) / factorial(inputs["servers"])
        probEmptySys = 1 / invP0
        probFullSys = probEmptySys * offeredLoad ** inputs["capacity"] / (factorial(inputs["servers"]) * inputs["servers"] ** (inputs["capacity"] - inputs["servers"]))
        meanNumInQueue = 0

        for (let i = inputs["servers"] + 1; i <= inputs["capacity"]; i++) {
            let Ppn = offeredLoad ** i / (factorial(inputs["servers"]) * inputs["servers"] ** (i - inputs["servers"])) * probEmptySys
            meanNumInQueue += (i - inputs["servers"]) * Ppn
        }
        effectiveArrivalRate = inputs["arrival-rate"] * (1 - probFullSys)
        meanTimeInQueue = meanNumInQueue / effectiveArrivalRate
        meanTimeInSys = meanTimeInQueue + (1 / inputs["service-rate"])
        meanNumInSys = meanTimeInSys * effectiveArrivalRate
    } else {
        let P0 = 1
        let factor = 1
        for (let i = 1; i <= inputs["servers"]; i++) {
            factor *= offeredLoad / i
            P0 += factor
        }
        if (inputs["servers"] < inputs["capacity"]) {
            let utilizationSum = utilization
            if (inputs["servers"] + 1 < inputs["capacity"]) {
                for (let i = inputs["servers"] + 2; i <= inputs["capacity"]; i++) {
                    utilizationSum += utilization ** (i - inputs["servers"])
                }
            }
            P0 += factor * utilizationSum
        }
        let invP0 = 1 / P0
        probEmptySys = invP0
        probFullSys = probEmptySys * offeredLoad ** inputs["capacity"] / (factorial(inputs["servers"]) * inputs["servers"] ** (inputs["capacity"] - inputs["servers"]))
        effectiveArrivalRate = inputs["arrival-rate"] * (1 - probFullSys)
        meanNumInQueue = probEmptySys * offeredLoad ** inputs["servers"] / (factorial(inputs["servers"]) * (1 - utilization) ** 2 * (1 - utilization ** (inputs["capacity"] - inputs["servers"]) - (inputs["capacity"] - inputs["servers"]) * utilization ** (inputs["capacity"] - inputs["servers"]) * (1 - utilization)))
        meanTimeInQueue = meanNumInQueue / effectiveArrivalRate
        meanTimeInSys = meanTimeInQueue + (1 / inputs["service-rate"])
        meanNumInSys = meanTimeInSys * effectiveArrivalRate
    }

    return {
        "utilization": effectiveArrivalRate / (inputs["service-rate"] * inputs["servers"]),
        "prob-empty-sys": probEmptySys,
        "prob-full-sys": probFullSys,
        "mean-num-in-sys": meanNumInSys,
        "mean-num-in-queue": meanNumInQueue,
        "mean-time-in-sys": meanTimeInSys,
        "mean-time-in-queue": meanTimeInQueue,
        "effective-arrival-rate": effectiveArrivalRate,
        "stability": true // always stable because of limited capacity
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
        let val = factorial(inputs["calling-population"]) / (factorial(inputs["calling-population"] - i) * factorial(inputs["servers"]) * (inputs["servers"] ** (i - inputs["servers"]))) * offeredLoad ** i
        Pi[i - 1] = val
        invP0 += val
    }

    probEmptySys = 1 / invP0
    meanNumInSys = 0
    meanNumInQueue = 0
    effectiveArrivalRate = inputs["calling-population"] * inputs["arrival-rate"] * probEmptySys
    for (let i = 1; i <= inputs["calling-population"]; i++) {
        Pi[i - 1] = Pi[i - 1] * probEmptySys
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
        "stability": true
    }
}

function GG1b(inputs) {
    const customerArrivalRate = 1 / inputs["mean-interarrival"]
    const cv2Process = inputs["standard-deviation-processing"] ** 2 / inputs["mean-processing"] ** 2
    const breakdownProportion = inputs["breakdown"] / (inputs["breakdown"] + inputs["fix"])
    const meanEffectiveProcessingTime = inputs["mean-processing"] / breakdownProportion
    const cv2Outage = inputs["fix"] === 0 ? 0 : inputs["standard-deviation-fix"] ** 2 / inputs["fix"] ** 2
    const cv2EffectiveProcess = cv2Process + (1 + cv2Outage) * breakdownProportion * (1 - breakdownProportion) * (inputs["fix"] / inputs["mean-processing"])
    const cv2CustomerInterarrival = inputs["standard-deviation-interarrival"] ** 2 / customerArrivalRate ** 2

    const V = (cv2EffectiveProcess + cv2CustomerInterarrival) / 2
    const u1 = customerArrivalRate * meanEffectiveProcessingTime
    const u2 = 1 / u1
    const WIPnb1 = V * (u1 ** 2 / (1 - u1)) + u1
    const WIPnb2 = V * (u2 ** 2 / (1 - u2)) + u2
    const rho = (WIPnb1 - u1) / WIPnb1
    const TH1 = customerArrivalRate * (1 - u1 * rho ** inputs["capacity"]) / (1 - (u1 ** 2) * rho ** inputs["capacity"])
    const rho_R = (WIPnb2 - u2) / WIPnb2
    const rho_2 = 1 / rho_R
    const TH2 = customerArrivalRate * (1 - u1 * rho_2 ** inputs["capacity"]) / (1 - (u1 ** 2) * rho_2 ** inputs["capacity"])
    const TH3 = customerArrivalRate * (cv2CustomerInterarrival + cv2EffectiveProcess + 2 * inputs["capacity"]) / (2 * (cv2EffectiveProcess + cv2CustomerInterarrival + inputs["capacity"]))
    const throughput = u1 < 1 ? TH1 : (u1 > 1 ? TH2 : TH3)
    const probFullSys = 1 - throughput / customerArrivalRate

    return {
        "throughput": throughput,
        "prob-full-sys": probFullSys,
        "stability": true // always stable because of limited capacity
    }
}

function GGc(inputs) {
    const customerArrivalRate = 1 / inputs["mean-interarrival"]
    const serverAvailability = inputs["breakdown"] / (inputs["breakdown"] + inputs["fix"])
    const cv2Process = inputs["standard-deviation-processing"] ** 2 / inputs["mean-processing"] ** 2
    const meanEffectiveProcessingTime = inputs["mean-processing"] / serverAvailability
    const cv2Outage = inputs["fix"] === 0 ? 0 : inputs["standard-deviation-fix"] ** 2 / inputs["fix"] ** 2
    const cv2EffectiveProcess = cv2Process + (1 + cv2Outage) * serverAvailability * (1 - serverAvailability) * (inputs["fix"] / inputs["mean-processing"])
    const cv2CustomerInterarrival = inputs["standard-deviation-interarrival"] ** 2 * customerArrivalRate ** 2
    const capacityUtilization = customerArrivalRate * meanEffectiveProcessingTime / inputs["servers"]

    const V = (cv2EffectiveProcess + cv2CustomerInterarrival) / 2
    const U = (1 / (inputs["servers"] * (1 - capacityUtilization))) * (capacityUtilization ** ((2 * (inputs["servers"] + 1)) ** 0.5 - 1))
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

function callCenters(inputs) {
    const R = inputs["arrival-rate"] / inputs["service-rate"]
    const beta = (inputs["servers"] - R) / (R ** 0.5)
    const theta = 1 / inputs["average-waiting-before-abandonment"]

    const beta_sqr_mu_theta = beta * ((inputs["service-rate"] / theta) ** 0.5)
    const h1_num = standardNormalPDF(beta_sqr_mu_theta)
    const h1_denom = cumulativeStdNormalProbability(-beta_sqr_mu_theta)
    const h1 = h1_num / h1_denom

    const sqr_mu_theta = (inputs["service-rate"] / theta) ** 0.5
    const h2_num = standardNormalPDF(-beta)
    const h2_denom = cumulativeStdNormalProbability(beta)
    const h2 = sqr_mu_theta * h2_num / h2_denom

    const sqr_theta_s_mu = (theta / (inputs["service-rate"] * inputs["servers"])) ** 0.5
    const h3_num = standardNormalPDF(beta_sqr_mu_theta + sqr_theta_s_mu)
    const h3_denom = cumulativeStdNormalProbability(-beta_sqr_mu_theta - sqr_theta_s_mu)
    const h3 = h3_num / h3_denom

    const sqr_s_mu_theta = inputs["waiting-more-than-t"] * (inputs["service-rate"] * inputs["servers"] * theta) ** 0.5
    const h4_num = h1_num
    const h4_denom = 1 - cumulativeStdNormalProbability(beta_sqr_mu_theta + sqr_s_mu_theta)
    const h4 = h4_num / h4_denom

    const fdc = 1 / (1 + (h1 / h2))
    const probCustWaitsMoreThanT = ((h1 / h4) * fdc * Math.exp(-theta * inputs["waiting-more-than-t"]))
    const asa = (1 / theta) * (1 - (h1 / h3)) * fdc
    const probAbandonment = asa * theta
    const expectedBusyAgents = R - R * (1 - h1 / h3) * fdc
    const occupancy = expectedBusyAgents / inputs["servers"]
    const expectedBusyLines = expectedBusyAgents + inputs["arrival-rate"] * asa
    const probAbandonmentGivenDelayed = probAbandonment / fdc

    return {
        "fraction-delayed-customers": fdc,
        "prob-cust-waits-more-than-t": probCustWaitsMoreThanT,
        "mean-time-in-queue": asa,
        "prob-abandonment": probAbandonment,
        "expected-busy-agents": expectedBusyAgents,
        "occupancy": occupancy,
        "expected-busy-lines": expectedBusyLines,
        "prob-abandonment-given-delayed": probAbandonmentGivenDelayed,
        "stability": isFinite(inputs["average-waiting-before-abandonment"]) || occupancy < 1
    }
}

function MG1Priority(inputs) {
    const rho1 = inputs["arrival-rate-type-1"] * inputs["mean-processing-type-1"]
    const rho2 = inputs["arrival-rate-type-2"] * inputs["mean-processing-type-2"]
    const rho3 = inputs["arrival-rate-type-3"] * inputs["mean-processing-type-3"]

    const prob1 = rho1 / (rho1 + rho2 + rho3)
    const prob2 = rho2 / (rho1 + rho2 + rho3)
    const prob3 = rho3 / (rho1 + rho2 + rho3)

    const a0 = 0
    const a1 = rho1
    const a2 = rho1 + rho2
    const a3 = rho1 + rho2 + rho3

    const val1 = inputs["arrival-rate-type-1"] * (inputs["mean-processing-type-1"] ** 2 + inputs["standard-deviation-processing-type-1"] ** 2)
    const val2 = inputs["arrival-rate-type-2"] * (inputs["mean-processing-type-2"] ** 2 + inputs["standard-deviation-processing-type-2"] ** 2)
    const val3 = inputs["arrival-rate-type-3"] * (inputs["mean-processing-type-3"] ** 2 + inputs["standard-deviation-processing-type-3"] ** 2)
    const sumval = val1 + val2 + val3

    const avgWaitingQueue1 = sumval / (2 * (1 - a0) * (1 - a1))
    const avgWaitingSystem1 = avgWaitingQueue1 + inputs["mean-processing-type-1"]
    const avgNumQueue1 = inputs["arrival-rate-type-1"] * avgWaitingQueue1
    const avgNumSystem1 = inputs["arrival-rate-type-1"] * avgWaitingSystem1

    const avgWaitingQueue2 = sumval / (2 * (1 - a1) * (1 - a2))
    const avgWaitingSystem2 = avgWaitingQueue2 + inputs["mean-processing-type-2"]
    const avgNumQueue2 = inputs["arrival-rate-type-2"] * avgWaitingQueue2
    const avgNumSystem2 = inputs["arrival-rate-type-2"] * avgWaitingSystem2

    const avgWaitingQueue3 = inputs["arrival-rate-type-1"] === 0 ? 0 : sumval / (2 * (1 - a2) * (1 - a3))
    const avgWaitingSystem3 = avgWaitingQueue3 + inputs["mean-processing-type-3"]
    const avgNumQueue3 = inputs["arrival-rate-type-3"] * avgWaitingQueue3
    const avgNumSystem3 = inputs["arrival-rate-type-3"] * avgWaitingSystem3

    return {
        "average-waiting-in-queue-type-1": avgWaitingQueue1,
        "average-waiting-in-queue-type-2": avgWaitingQueue2,
        "average-waiting-in-queue-type-3": avgWaitingQueue3,
        "average-waiting-in-system-type-1": avgWaitingSystem1,
        "average-waiting-in-system-type-2": avgWaitingSystem2,
        "average-waiting-in-system-type-3": avgWaitingSystem3,
        "average-number-in-queue-type-1": avgNumQueue1,
        "average-number-in-queue-type-2": avgNumQueue2,
        "average-number-in-queue-type-3": avgNumQueue3,
        "average-number-in-system-type-1": avgNumSystem1,
        "average-number-in-system-type-2": avgNumSystem2,
        "average-number-in-system-type-3": avgNumSystem3,
        "mean-time-in-queue": avgWaitingQueue1 * prob1 + avgWaitingQueue2 * prob2 + avgWaitingQueue3 * prob3,
        "mean-time-in-sys": avgWaitingSystem1 * prob1 + avgWaitingSystem2 * prob2 + avgWaitingSystem3 * prob3,
        "mean-num-in-queue": avgNumQueue1 + avgNumQueue2 + avgNumQueue3,
        "mean-num-in-sys": avgNumSystem1 + avgNumSystem2 + avgNumSystem3,
        "stability": a3 < 1
    }
}

export const CALCULATIONS = {
    "MG1": MG1,
    "MGs": MGs,
    "MMs": MMs,
    "MMsc": MMsc,
    "MMsNN": MMsNN,
    "GG1b": GG1b,
    "GGc": GGc,
    "callCenters": callCenters,
    "MG1Priority": MG1Priority
}