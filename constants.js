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
    "MMsc": [["arrival-rate", "service-rate", "servers", "capacity"], ["utilization", "prob-empty-sys", "prob-full-sys", "mean-num-in-sys", "mean-num-in-queue", "mean-time-in-sys", "mean-time-in-queue", "effective-arrival-rate"]],
    "MMsNN": [["arrival-rate", "service-rate", "servers", "calling-population"], ["utilization", "prob-empty-sys", "mean-num-in-sys", "mean-num-in-queue", "mean-time-in-sys", "mean-time-in-queue", "effective-arrival-rate"]],
    "GG1b": [["mean-interarrival", "standard-deviation-interarrival", "mean-processing", "standard-deviation-processing", "breakdown", "fix", "standard-deviation-fix", "capacity"], ["throughput", "prob-full-sys"]],
    "GGc": [["mean-interarrival", "standard-deviation-interarrival", "mean-processing", "standard-deviation-processing", "breakdown", "fix", "standard-deviation-fix", "servers"], ["utilization", "mean-num-in-sys", "mean-num-in-queue", "mean-time-in-sys", "mean-time-in-queue", "mean-interdeparture", "standard-deviation-interdeparture"]],
    "callCenters": [["arrival-rate", "service-rate", "average-waiting-before-abandonment", "servers", "waiting-more-than-t"], ["fraction-delayed-customers", "prob-cust-waits-more-than-t", "mean-time-in-queue", "prob-abandonment", "expected-busy-agents", "occupancy", "expected-busy-lines", "prob-abandonment-given-delayed"]],
    "MG1Priority": [["arrival-rate-type-1", "arrival-rate-type-2", "arrival-rate-type-3", "mean-processing-type-1", "standard-deviation-processing-type-1", "mean-processing-type-2", "standard-deviation-processing-type-2", "mean-processing-type-3", "standard-deviation-processing-type-3"], ["average-waiting-in-queue-type-1", "average-waiting-in-queue-type-2", "average-waiting-in-queue-type-3", "average-waiting-in-system-type-1", "average-waiting-in-system-type-2", "average-waiting-in-system-type-3", "average-number-in-queue-type-1", "average-number-in-queue-type-2", "average-number-in-queue-type-3", "average-number-in-system-type-1", "average-number-in-system-type-2", "average-number-in-system-type-3", "mean-time-in-queue", "mean-time-in-sys", "mean-num-in-queue", "mean-num-in-sys"]]
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
    "calling-population": {
		"name": "Size of Calling Population",
		"symbol": "N",
		"description": "Size of population of customers being served."
	},
    "waiting-more-than-t": {
        "name": "Waiting More Than T",
        "symbol": "T",
        "description": "Specify a number of units of time."
    },
    "average-waiting-before-abandonment": {
        "name": "Average Waiting Before Abandonment",
        "symbol": "\\frac{1}{\\theta}",
        "description": "The average time a customer waits in queue before abandoning the queue."
    },
    "arrival-rate-type-1": {
        "name": "Arrival Rate For Type 1",
        "symbol": "\\lambda_1",
        "description": "The number of arrivals in a unit of time for customers of type 1.",
        "units": "rate"
    },
    "arrival-rate-type-2": {
        "name": "Arrival Rate For Type 2",
        "symbol": "\\lambda_2",
        "description": "The number of arrivals in a unit of time for customers of type 2.",
        "units": "rate"
    },
    "arrival-rate-type-3": {
        "name": "Arrival Rate For Type 3",
        "symbol": "\\lambda_3",
        "description": "The number of arrivals in a unit of time for customers of type 3.",
        "units": "rate"
    },
    "mean-processing-type-1": {
        "name": "Mean Processing Time For Type 1",
        "symbol": "T_{\\mu_1}",
        "description": "The average time to service a customer of type 1.",
        "units": "time"
    },
    "standard-deviation-processing-type-1": {
        "name": "Std. Dev. Processing Time For Type 1",
        "symbol": "\\sigma_{T, \\mu_1}",
        "description": "The standard deviation of customer processing times for type 1.",
        "units": "time"
    },
    "mean-processing-type-2": {
        "name": "Mean Processing Time For Type 2",
        "symbol": "T_{\\mu_2}",
        "description": "The average time to service a customer of type 2.",
        "units": "time"
    },
    "standard-deviation-processing-type-2": {
        "name": "Std. Dev. Processing Time For Type 2",
        "symbol": "\\sigma_{T, \\mu_2}",
        "description": "The standard deviation of customer processing times for type 2.",
        "units": "time"
    },
    "mean-processing-type-3": {
        "name": "Mean Processing Time For Type 3",
        "symbol": "T_{\\mu_3}",
        "description": "The average time to service a customer of type 3.",
        "units": "time"
    },
    "standard-deviation-processing-type-3": {
        "name": "Std. Dev. Processing Time For Type 3",
        "symbol": "\\sigma_{T, \\mu_3}",
        "description": "The standard deviation of customer processing times for type 3.",
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
        "name": "Std. Dev. Interdeparture Time",
        "symbol": "\\sigma_{T, d}",
        "description": "The standard deviation of the time between customer departures",
        "units": "time"
    },
    "fraction-delayed-customers": {
        "name": "Fraction of Delayed Customers",
        "symbol": "FDC",
        "description": "The fraction of customers who are delayed in the system."
    },
    "prob-abandonment": {
        "name": "Probability of Abandonment",
        "symbol": "P(A)",
        "description": "The probability a customer abandons the queue."
    },
    "expected-busy-agents": {
        "name": "Expected Number of Busy Agents",
        "symbol": "\\mathbb{E}[B]",
        "description": "The expected number of agents busy on calls."
    },
    "occupancy": {
        "name": "Occupancy",
        "symbol": "\\rho",
        "description": "The average proportion of total agents in use."
    },
    "expected-busy-lines": {
        "name": "Expected Number of Busy Lines",
        "symbol": "\\mathbb{E}[N_s]",
        "description": "The expected number of lines busy with calls."
    },
    "prob-abandonment-given-delayed": {
        "name": "Probability of Abandonment Given Delayed",
        "symbol": "P(A|W_q>0)",
        "description": "The probability a customer abandons the queue given they are delayed."
    },
    "average-waiting-in-queue-type-1": {
        "name": "Average Waiting in Queue, Type 1",
        "symbol": "W_{q_1}",
        "description": "The average time a customer of type 1 spends waiting in queue.",
        "units": "time"
    },
    "average-waiting-in-queue-type-2": {
        "name": "Average Waiting in Queue, Type 2",
        "symbol": "W_{q_2}",
        "description": "The average time a customer of type 2 spends waiting in queue.",
        "units": "time"
    },
    "average-waiting-in-queue-type-3": {
        "name": "Average Waiting in Queue, Type 3",
        "symbol": "W_{q_3}",
        "description": "The average time a customer of type 3 spends waiting in queue.",
        "units": "time"
    },
    "average-waiting-in-system-type-1": {
        "name": "Average Waiting in System, Type 1",
        "symbol": "W_{1}",
        "description": "The average time a customer of type 1 spends in the system.",
        "units": "time"
    },
    "average-waiting-in-system-type-2": {
        "name": "Average Waiting in System, Type 2",
        "symbol": "W_{2}",
        "description": "The average time a customer of type 2 spends in the system.",
        "units": "time"
    },
    "average-waiting-in-system-type-3": {
        "name": "Average Waiting in System, Type 3",
        "symbol": "W_{3}",
        "description": "The average time a customer of type 3 spends in the system.",
        "units": "time"
    },
    "average-number-in-queue-type-1": {
        "name": "Average Number in Queue, Type 1",
        "symbol": "L_{q_1}",
        "description": "The average number of customers of type 1 in the queue."
    },
    "average-number-in-queue-type-2": {
        "name": "Average Number in Queue, Type 2",
        "symbol": "L_{q_2}",
        "description": "The average number of customers of type 2 in the queue."
    },
    "average-number-in-queue-type-3": {
        "name": "Average Number in Queue, Type 3",
        "symbol": "L_{q_3}",
        "description": "The average number of customers of type 3 in the queue."
    },
    "average-number-in-system-type-1": {
        "name": "Average Number in System, Type 1",
        "symbol": "L_{1}",
        "description": "The average number of customers of type 1 in the system."
    },
    "average-number-in-system-type-2": {
        "name": "Average Number in System, Type 2",
        "symbol": "L_{2}",
        "description": "The average number of customers of type 2 in the system."
    },
    "average-number-in-system-type-3": {
        "name": "Average Number in System, Type 3",
        "symbol": "L_{3}",
        "description": "The average number of customers of type 3 in the system."
    },
}

export const QUEUE_TO_DESCRIPTION_MAP = {
    "MG1": "In the M/G/1 Queueing System,$\\\\$Arrival: Customers arrive according to a Poisson process with rate $\\lambda$ per unit time, which implies that the time between consecutive arrivals follows an Exponential distribution with mean $\\frac{1}{\\lambda}$.$\\\\$Service: Service times follow a General distribution with mean $\\frac{1}{\\mu}$ and variance $\\sigma^2$. $\\\\$Servers: There is a single server.$\\\\$System Capacity: There is not a limit on the number of customers that can wait in the system.$\\\\$Customer Population: There is a very large population of potential customers who arrive randomly when they need to use the system.$\\\\$Service Discipline: Customers are served on a first-come, first-served basis.",
    "MGs": "In the M/G/s Queueing System,$\\\\$Arrival: Customers arrive according to a Poisson process with rate $\\lambda$ per unit time, which implies that the time between consecutive arrivals follows an Exponential distribution with mean $\\frac{1}{\\lambda}$.$\\\\$Service: Service times follow a General distribution with mean $\\frac{1}{\\mu}$ and variance $\\sigma^2$. $\\\\$Servers: There are $s$ servers.$\\\\$System Capacity: There is not a limit on the number of customers that can wait in the system.$\\\\$Customer Population: There is a very large population of potential customers who arrive randomly when they need to use the system.$\\\\$Service Discipline: Customers are served on a first-come, first-served basis.",
    "MMs": "In the M/M/s Queueing System,$\\\\$Arrival: Customers arrive according to a Poisson process with rate $\\lambda$ per unit time, which implies that the time between consecutive arrivals follows an Exponential distribution with mean $\\frac{1}{\\lambda}$.$\\\\$Service: Service times follow an Exponential distribution with mean $\\frac{1}{\\mu}$. $\\\\$Servers: There are $s$ servers.$\\\\$System Capacity: There is not a limit on the number of customers that can wait in the system.$\\\\$Customer Population: There is a very large population of potential customers who arrive randomly when they need to use the system.$\\\\$Service Discipline: Customers are served on a first-come, first-served basis.",
    "MMsc": "In the M/M/s/c Queueing System,$\\\\$Arrival: Customers arrive according to a Poisson process with rate $\\lambda$ per unit time, which implies that the time between consecutive arrivals follows an Exponential distribution with mean $\\frac{1}{\\lambda}$.$\\\\$Service: Service times follow an Exponential distribution with mean $\\frac{1}{\\mu}$. $\\\\$Servers: There are $s$ servers.$\\\\$System Capacity: There is a maximum of $b$ customers that can be in the system.$\\\\$Customer Population: There is a very large population of potential customers who arrive randomly when they need to use the system.$\\\\$Service Discipline: Customers are served on a first-come, first-served basis.",
    "MMsNN": "In the M/M/s/N/N Queueing System,$\\\\$Arrival: Customers arrive according to a Poisson process with rate $\\lambda$ per unit time, which implies that the time between consecutive arrivals follows an Exponential distribution with mean $\\frac{1}{\\lambda}$.$\\\\$Service: Service times follow an Exponential distribution with mean $\\frac{1}{\\mu}$. $\\\\$Servers: There are $s$ servers.$\\\\$System Capacity: There is a limit of $N$ customers in the system.$\\\\$Customer Population: There is a limit of $N$ customers in the population.$\\\\$Service Discipline: Customers are served on a first-come, first-served basis.",
    "GG1b": "In the G/G/1/b Queueing System,$\\\\$Arrival: Customers arrive according to a General distribution with mean $T_{\\lambda}$ and variance $\\sigma_{T, \\lambda}^2$.$\\\\$Service: Service times follow a General distribution with mean $T_{\\mu}$ and variance $\\sigma_{T, \\mu}^2$. $\\\\Servers: There is a single server.$\\\\$System Capacity: There is a limit of $b$ customers in the system.$\\\\$Since the rest of the parameters are unspecified, there is a very large population of potential customers who arrive randomly when they need to use the system, and customers are served on a first-come, first-served basis. Additionally, the server breaks down after a time $T_b$ (Exponential distribution with mean $\\frac{1}{T_b}$) and is fixed after a time $T_f$ with standard deviation $\\sigma_{T, f}$ (distributed General).",
    "GGc": "In the G/G/c Queueing System,$\\\\$Arrival: Customers arrive according to a General distribution with mean $T_{\\lambda}$ and variance $\\sigma_{T, \\lambda}^2$.$\\\\$Service: Service times follow a General distribution with mean $T_{\\mu}$ and variance $\\sigma_{T,\\mu}^2$. $\\\\$Servers: There are $s$ servers.$\\\\$System Capacity: There is not a limit on the number of customers that can wait in the system.$\\\\$Customer Population: There is a very large population of potential customers who arrive randomly when they need to use the system.$\\\\$Service Discipline: Customers are served on a first-come, first-served basis.$\\\\$Additionally, each server breaks down after a time $T_b$ (Exponential distribution with mean $\\frac{1}{T_b}$) and is fixed after a time $T_f$ with standard deviation $\\sigma_{T, f}$ (distributed General).",
    "callCenters": "In the Call Center Queueing System,$\\\\$Arrival: Customers arrive according to a Poisson process with rate $\\lambda$ per unit time, which implies that the time between consecutive arrivals follows an Exponential distribution with mean $\\frac{1}{\\lambda}$.$\\\\$Service: Service times follow an Exponential distribution with mean $\\frac{1}{\\mu}$. $\\\\$Servers: There are $s$ servers.$\\\\$System Capacity: There is not a limit on the number of customers that can wait in the system.$\\\\$Customer Population: There is a very large population of potential customers who arrive randomly when they need to use the system.$\\\\$Service Discipline: Customers are served on a first-come, first-served basis.$\\\\$Additionally, customers abandon the queue after waiting for a time $\\theta$ (Exponential distribution with mean $\\frac{1}{\\theta}$).",
    "MG1Priority": "In the M/G/1 Priority Queueing System,$\\\\$Arrival: Customers of differing priorities arrive according to a Poisson process with rate $\\lambda_i$ per unit time (where $i$ is the priority, with 1 being the highest). This implies that the time between consecutive arrivals follows an Exponential distribution with mean $\\frac{1}{\\lambda_i}$ for each customer type.$\\\\$Service: Service times follow a General distribution with mean $T_{\\mu_i}$ and variance $\\sigma_{T,\\mu_i}^2$ for each type. $\\\\$Servers: There is a single server.$\\\\$$System Capacity: There is not a limit on the number of customers that can wait in the system.$\\\\$Customer Population: There is a very large population of potential customers who arrive randomly when they need to use the system.$\\\\$Service Discipline: After serving a customer, the server will prioritize customers of type 1, which are served first, then type 2, then type 3."
}