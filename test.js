import { CALCULATIONS } from './calculations';


function testRig(result, expected, testName, places=2) {
    const relativeError = (result - expected) / expected
    const equalToPlaces = parseFloat(result.toFixed(places)) === parseFloat(expected.toFixed(places))
    // Relative error less than < 1% to account for rounding differences in the textbook
    if (equalToPlaces || Math.abs(relativeError) < 10 ** -2) {
        console.log(`passed test ${testName}`)
    } else {
        console.log(`failed test ${testName}, expected ${expected}, got ${result}`)
    }
}

// Square Root Staffing in large M/M/s queues
function test1() {
    const result = CALCULATIONS["MMs"]({
        "arrival-rate": 600,
        "service-rate": 6,
        "servers": 118, // very sensitive, but 117 is not enough with exact calculation (good for approximation though!)
        "waiting-more-than-t": 1
    })

    testRig(result['prob-cust-waits'], 0.05, "Square Root Staffing in large M/M/s queues", places=2)
}

// M/M/s (callCenters) with abandonment
function test2() {
    const result = CALCULATIONS["callCenters"]({
        "arrival-rate": 1400,
        "service-rate": 15,
        "average-waiting-before-abandonment": 30 / 3600,
        "servers": 95,
        "waiting-more-than-t": 20 / 3600
    })

    testRig(result["fraction-delayed-customers"], 0.226, "Call Centers FDC", places=3)
    testRig(result["prob-cust-waits-more-than-t"], 1 - 0.9978, "Call Centers P(hold > T)", places=3)
    testRig(result["mean-time-in-queue"], 1.29 / 3600, "Call Centers Mean Time in Queue", places=3)
    testRig(result["prob-abandonment"], 0.043, "Call Centers P(abandon)", places=2)
    testRig(result["expected-busy-agents"], 89.32, "Call Centers Expected Busy Agents", places=2)
    testRig(result["expected-busy-lines"], 89.82, "Call Centers Expected Busy Lines", places=2)
    testRig(result["occupancy"], 0.9402, "Call Centers Occupancy", places=3)
    testRig(result["prob-abandonment-given-delayed"], 0.19, "Call Centers P(abandon | delayed)", places=2)
}

// M/M/s/c Quick Lube
function test3() {
    let result = CALCULATIONS["MMsc"]({
        "arrival-rate": 36,
        "service-rate": 10,
        "servers": 3,
        "capacity": 7
    })

    testRig(result["utilization"], 0.919, "M/M/s/c Utilization", places=3)
    testRig(result["mean-num-in-sys"], 4.738, "M/M/s/c Mean Number in System", places=3)
    testRig(result["mean-time-in-sys"], 0.172, "M/M/s/c Mean Time in System", places=3)
    testRig(result["mean-time-in-queue"], 0.072, "M/M/s/c Mean Time in Queue", places=3)
    testRig(result["mean-num-in-queue"], 1.980, "M/M/s/c Mean Number in Queue", places=3)
    testRig(result["prob-empty-sys"], 0.015, "M/M/s/c empty", places=3)
    testRig(result["prob-full-sys"], 0.234, "M/M/s/c full", places=3)
    testRig(result["effective-arrival-rate"], 27.581, "M/M/s/c effective arrival rate", places=3)

    result = CALCULATIONS["MMsc"]({
        "arrival-rate": 36,
        "service-rate": 10,
        "servers": 3,
        "capacity": 11
    })

    testRig(result["utilization"], 0.968, "M/M/s/c Utilization", places=3)
    testRig(result["mean-num-in-sys"], 7.736, "M/M/s/c Mean Number in System", places=3)
    testRig(result["mean-time-in-sys"], 0.266, "M/M/s/c Mean Time in System", places=3)
    testRig(result["mean-time-in-queue"], 0.166, "M/M/s/c Mean Time in Queue", places=3)
    testRig(result["mean-num-in-queue"], 4.833, "M/M/s/c Mean Number in Queue", places=3)
    testRig(result["prob-empty-sys"], 0.006, "M/M/s/c empty", places=3)
    testRig(result["prob-full-sys"], 0.193, "M/M/s/c full", places=3)
    testRig(result["effective-arrival-rate"], 29.035, "M/M/s/c effective arrival rate", places=3)

    result = CALCULATIONS["MMsc"]({
        "arrival-rate": 36,
        "service-rate": 10,
        "servers": 4,
        "capacity": 8
    })

    testRig(result["utilization"], 0.813, "M/M/s/c Utilization", places=3)
    testRig(result["mean-num-in-sys"], 4.332, "M/M/s/c Mean Number in System", places=3)
    testRig(result["mean-time-in-sys"], 0.133, "M/M/s/c Mean Time in System", places=3)
    testRig(result["mean-time-in-queue"], 0.033, "M/M/s/c Mean Time in Queue", places=3)
    testRig(result["mean-num-in-queue"], 1.080, "M/M/s/c Mean Number in Queue", places=3)
    testRig(result["prob-empty-sys"], 0.021, "M/M/s/c empty", places=3)
    testRig(result["prob-full-sys"], 0.097, "M/M/s/c full", places=3)
    testRig(result["effective-arrival-rate"], 32.521, "M/M/s/c effective arrival rate", places=3)
}

// M/M/s/c Parking Lot, also the Erlang-B model where s = c
function test4() {
    let result = CALCULATIONS["MMsc"]({
        "arrival-rate": 100,
        "service-rate": 0.5,
        "servers": 50,
        "capacity": 50
    })

    testRig(result["utilization"], 0.993, "M/M/s/c Utilization", places=3)
    testRig(result["mean-num-in-sys"], 49.672, "M/M/s/c Mean Number in System", places=3)
    testRig(result["mean-time-in-sys"], 2, "M/M/s/c Mean Time in System", places=3)
    testRig(result["mean-time-in-queue"], 0, "M/M/s/c Mean Time in Queue", places=3)
    testRig(result["mean-num-in-queue"], 0, "M/M/s/c Mean Number in Queue", places=3)
    testRig(result["prob-empty-sys"], 0, "M/M/s/c empty", places=3)
    testRig(result["prob-full-sys"], 0.752, "M/M/s/c full", places=3)
    testRig(result["effective-arrival-rate"], 24.836, "M/M/s/c effective arrival rate", places=3)
}

// G/G/s DMV
function test5() {
    let result = CALCULATIONS["GGs"]({
        "mean-interarrival": 0.5,
        "standard-deviation-interarrival": 0.5,
        "mean-processing": 4.65,
        "standard-deviation-processing": 14,
        "breakdown": 1,
        "fix": 0,
        "standard-deviation-fix": 0,
        "servers": 10
    })

    testRig(result["utilization"], 0.93, "G/G/s Utilization", places=3)
    testRig(result["mean-time-in-queue"], 25.57, "G/G/s Mean Time in Queue", places=2)
    testRig(result["mean-time-in-sys"], 25.57 + 4.65, "G/G/s Mean Time in System", places=2)
    testRig(result["mean-num-in-queue"], 51.15, "G/G/s Mean Number in Queue", places=2)
    testRig(result["mean-num-in-sys"], 2 * (25.57 + 4.65), "G/G/s Mean Number in System", places=2)
}

// M/G/1 with priority, Custom-Chrome
function test6() {
    let result = CALCULATIONS["MG1Priority"]({
        "arrival-rate-type-1": 0.02 / 60,
        "arrival-rate-type-2": 0.04 / 60,
        "arrival-rate-type-3": 0.07 / 60,
        "mean-processing-type-1": 5 * 60,
        "mean-processing-type-2": 6 * 60,
        "mean-processing-type-3": 8 * 60,
        "standard-deviation-processing-type-1": 3 * 60,
        "standard-deviation-processing-type-2": 4 * 60,
        "standard-deviation-processing-type-3": 8 * 60,
    })

    testRig(result["average-waiting-in-queue-type-1"], 408.84, "MG1Priority Average Waiting in Queue Type 1", places=1)
    testRig(result["average-waiting-in-queue-type-2"], 633.04, "MG1Priority Average Waiting in Queue Type 2", places=1)
    testRig(result["average-waiting-in-queue-type-3"], 9073.5, "MG1Priority Average Waiting in Queue Type 3", places=1)
    testRig(result["average-waiting-in-system-type-1"], 708.84, "MG1Priority Average Waiting in System Type 1", places=1)
    testRig(result["average-waiting-in-system-type-2"], 993.04, "MG1Priority Average Waiting in System Type 2", places=1)
    testRig(result["average-waiting-in-system-type-3"], 9553.5, "MG1Priority Average Waiting in System Type 3", places=1)
    testRig(result["average-number-in-queue-type-1"], 0.142, "MG1Priority Average Number in Queue Type 1", places=1)
    testRig(result["average-number-in-queue-type-2"], 0.440, "MG1Priority Average Number in Queue Type 2", places=1)
    testRig(result["average-number-in-queue-type-3"], 11.027, "MG1Priority Average Number in Queue Type 3", places=1)
    testRig(result["average-number-in-system-type-1"], 0.246, "MG1Priority Average Number in System Type 1", places=1)
    testRig(result["average-number-in-system-type-2"], 0.690, "MG1Priority Average Number in System Type 2", places=1)
    testRig(result["average-number-in-system-type-3"], 11.610, "MG1Priority Average Number in System Type 3", places=1)
    testRig(result["mean-time-in-queue"], 85.724, "MG1Priority Mean Time in Queue", places=1)
    testRig(result["mean-time-in-sys"], 92.647, "MG1Priority Mean Time in System", places=1)
    testRig(result["mean-num-in-queue"], 11.608, "MG1Priority Mean Number in Queue", places=1)
    testRig(result["mean-num-in-sys"], 12.546, "MG1Priority Mean Number in System", places=1)
}

// M/M/s/N/N, CCU Operations
function test7() {
    let result = CALCULATIONS["MMsNN"]({
        "arrival-rate": 1.5,
        "service-rate": 1.5,
        "servers": 2,
        "calling-population": 2
    })

    testRig(result["utilization"], 0.902, "M/M/s/N/N Utilization", places=3)
    testRig(result["effective-arrival-rate"], 5.414, "M/M/s/N/N Effective Arrival Rate", places=3)
    testRig(result["mean-time-in-queue"], 0.329, "M/M/s/N/N Mean Time in Queue", places=3)
    testRig(result["mean-time-in-sys"], 0.662, "M/M/s/N/N Mean Time in System", places=3)
    testRig(result["mean-num-in-queue"], 1.781, "M/M/s/N/N Mean Number in Queue", places=3)
    testRig(result["mean-num-in-sys"], 3.586, "M/M/s/N/N Mean Number in System", places=3)
    testRig(result["prob-empty-sys"], 0.0039, "M/M/s/N/N empty", places=3)
}

// M/M/s/N/N, Fleet Management
function test8() {
    let result = CALCULATIONS["MMsNN"]({
        "arrival-rate": 5,
        "service-rate": 2,
        "servers": 3,
        "calling-population": 6
    })

    testRig(result["utilization"], 0.561, "M/M/s/N/N Utilization", places=3)
    testRig(result["effective-arrival-rate"], 5.414, "M/M/s/N/N Effective Arrival Rate", places=3)
    testRig(result["mean-time-in-queue"], 0.329, "M/M/s/N/N Mean Time in Queue", places=3)
    testRig(result["mean-time-in-sys"], 0.662, "M/M/s/N/N Mean Time in System", places=3)
    testRig(result["mean-num-in-queue"], 1.781, "M/M/s/N/N Mean Number in Queue", places=3)
    testRig(result["mean-num-in-sys"], 3.586, "M/M/s/N/N Mean Number in System", places=3)
    testRig(result["prob-empty-sys"], 0.0039, "M/M/s/N/N empty", places=3)
}

test1()
test2()
test3()
test4()
test5()
test6()
test7()