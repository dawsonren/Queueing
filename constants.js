/*

Provide maps.

Type of Queue => [Input Keys, Output Keys]

Input Keys => Rendering Data

Output Keys => Rendering Data

*/

export const QUEUE_TO_INPUT_OUTPUT_KEYS_MAP = {
    "MG1": [["arrival-rate", "service-rate", "variance"], ["utilization", "prob-empty-sys", "mean-num-in-sys", "mean-num-in-queue", "mean-time-in-sys", "mean-time-in-queue"]],
    "MGs": [["arrival-rate", "service-rate", "variance", "servers"], ["utilization", "prob-empty-sys", "mean-num-in-sys", "mean-num-in-queue", "mean-time-in-sys", "mean-time-in-queue"]],
    "MMs": [["arrival-rate", "service-rate", "servers", "waiting-more-than-t"], ["utilization", "prob-empty-sys", "mean-num-in-sys", "mean-num-in-queue", "mean-time-in-sys", "mean-time-in-queue", "prob-cust-waits", "prob-cust-waits-more-than-t"]],
    "MMsc": [["arrival-rate", "service-rate", "servers", "capacity"], ["utilization", "prob-empty-sys", "mean-num-in-sys", "mean-num-in-queue", "mean-time-in-sys", "mean-time-in-queue", "prob-cust-waits", "prob-cust-waits-more-than-t", "effective-arrival-rate"]],
    "MMsNN": [["arrival-rate", "service-rate", "servers", "calling-population"], ["utilization", "prob-empty-sys", "mean-num-in-sys", "mean-num-in-queue", "mean-time-in-sys", "mean-time-in-queue", "effective-arrival-rate"]],
    "GG1b": [["mean-interarrival", "standard-deviation-interarrival", "mean-processing", "standard-deviation-processing", "breakdown", "fix", "standard-deviation-fix", "capacity"], ["throughput", "prob-full-sys"]],
    "GGc": [["mean-interarrival", "standard-deviation-interarrival", "mean-processing", "standard-deviation-processing", "breakdown", "fix", "standard-deviation-fix", "servers"], ["utilization", "mean-num-in-sys", "mean-num-in-queue", "mean-time-in-sys", "mean-time-in-queue", "mean-interdeparture", "standard-deviation-interdeparture"]]
}

export const INPUT_TO_RENDING_DATA_MAP = {
	"arrival-rate": {
		"name": "Arrival Rate",
		"symbol": "\\lambda",
		"description": "The number of arrivals in a unit of time.",
		"units": "rate"
	},
    "service-rate": {
		"name": "Service Rate",
		"symbol": "\\mu",
		"description": "The number of customers able to be serviced in a unit of time by a single server.",
		"units": "rate"
	},
    "variance": {
		"name": "Variance of Service Time",
		"symbol": "\\sigma^2",
		"description": "The variance of service time.",
	},
    "mean-interarrival": {
		"name": "Mean Interarrival Time",
		"symbol": "T_{\\lambda}",
		"description": "The average interarrival time between customers.",
		"units": "time"
	},
    "standard-deviation-interarrival": {
		"name": "Standard Deviation of Interarrival Time",
		"symbol": "\\sigma_{T, \\lambda}",
		"description": "The standard deviation of customer interarrival times.",
		"units": "time"
	},
    "mean-processing": {
		"name": "Mean Processing Time",
		"symbol": "T_{\\mu}",
		"description": "The average time to service a customer.",
		"units": "time"
	},
    "standard-deviation-processing": {
 		"name": "Standard Deviation of Processing Time",
		"symbol": "\\sigma_{T, \\mu}",
		"description": "The standard deviation of customer processing times.",
		"units": "time"
	},
    "breakdown": {
		"name": "Mean Time to Breakdown",
		"symbol": "T_b",
		"description": "The average time until a server breaks down.",
		"units": "time"
	},
    "fix": {
		"name": "Mean Time to Fix Server",
		"symbol": "T_f",
		"description": "The average time to fix a server.",
		"units": "time"
	},
    "standard-deviation-fix": {
		"name": "Standard Deviation of Fix Time",
		"symbol": "\\sigma_{T, f}",
		"description": "The standard deviation of time to fix a server.",
		"units": "time"
	},
    "servers": {
		"name": "Number of Servers",
		"symbol": "s",
		"description": "The number of servers."
	},
    "capacity": {
		"name": "System Capacity",
		"symbol": "c",
		"description": "The system capacity, including customers in service."
	},
    "time": {
		"name": "Waiting More Than T",
		"symbol": "T",
		"description": "Specify a number of units of time.",
		"units": "time",
	},
    "calling-population": {
		"name": "Size of Calling Population",
		"symbol": "N",
		"description": "Size of population of customers being served."
	},
    "waiting-more-than-t": {
        "name": "Waiting More Than T",
        "symbol": "T",
        "description": "Specify a number of units of time.",
        "units": "time"
    }
}

export const OUTPUT_TO_RENDING_DATA_MAP = {
    "utilization": {
        "name": "Utilization",
        "symbol": "\\rho",
        "description": "The average proportion of total capacity in use."
    },
    "mean-num-in-sys": {
        "name": "Mean Number in System",
        "symbol": "L",
        "description": "The mean number of customers in the system."
    },
    "mean-time-in-sys": {
        "name": "Mean Time in System",
        "symbol": "W",
        "description": "The mean time a customer spends in a system.",
        "units": "time"
    },
    "mean-time-in-queue": {
        "name": "Mean Time in Queue",
        "symbol": "W_q",
        "description": "The mean time a customer spends waiting in the queue.",
        "units": "time"
    },
    "mean-num-in-queue": {
        "name": "Mean Number in Queue",
        "symbol": "L_q",
        "description": "The mean number of customers in the queue."
    },
    "prob-empty-sys": {
        "name": "Probability of an Empty System",
        "symbol": "P_0",
        "description": "The probability an arrival faces an empty system."
    },
    "prob-full-sys": {
        "name": "Probability of a Full System",
        "symbol": "P_c",
        "description": "The probability an arrival faces a full system."
    },
    "effective-arrival-rate": {
        "name": "Effective Arrival Rate",
        "symbol": "\\lambda_e",
        "description": "The arrival rate once customers who leave due to a full system are taken into account."
    },
    "prob-cust-waits": {
        "name": "Probability Customer Waits",
        "symbol": "P(W_q>0)",
        "description": "The probability a customer has to wait in line before service."
    },
    "prob-cust-waits-more-than-t": {
        "name": "Probability Customer Waits More than T",
        "symbol": "P(W_q>T)",
        "description": "The probability a customer has to wait in line for more than T units of time before service."
    },
    "throughput": {
        "name": "Throughput",
        "symbol": "R",
        "description": "Number of customers per time unit served",
        "units": "rate"
    },
    "mean-interdeparture": {
        "name": "Mean Interdeparture Time",
        "symbol": "T_{d}",
        "description": "The average time between customer departures.",
        "units": "time"
    },
    "standard-deviation-interdeparture": {
        "name": "Standard Deviation of Interdeparture Time",
        "symbol": "\\sigma_{T, d}",
        "description": "The standard deviation of the time between customer departures",
        "units": "time"
    }
}