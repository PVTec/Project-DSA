# Dynamic Traffic Orchestration: A Comparative Study of Server Load Balancing

**Author(s):** Vincent Layon, Edudardo Castro
**Affiliation:** College of Bachelor of Science in Information Technology, SUNN, Philippines
**Contact:** *[email]*

---

## Abstract

This study presents an interactive simulation environment designed to analyze and compare server load balancing algorithms. In distributed systems, efficient traffic management is critical to ensure high availability, reliability, and performance. The project initially implements the Weighted Round Robin (WRR) algorithm, a static technique that distributes requests based on predefined server capacities. It is designed to be extended with Consistent Hashing, a dynamic algorithm that adapts to server changes with minimal disruption. By visualizing these approaches, the project provides practical insights into their mechanics, trade-offs, and ideal use cases. The simulation highlights WRR’s simplicity and fairness in static environments, while demonstrating Consistent Hashing’s scalability and resilience in dynamic systems. The results emphasize the importance of choosing appropriate load balancing strategies depending on system requirements, offering an educational tool for students and practitioners to understand the principles of static and dynamic traffic orchestration.

**Keywords:** Consistent Hashing, Load Balancing, Server Nodes, Traffic Distribution, Weighted Round Robin

---

## 1. Introduction

Load balancing is a fundamental concept in distributed computing, ensuring that workloads are evenly distributed across multiple servers to prevent bottlenecks and improve responsiveness. In web services, this process involves directing user requests to a pool of servers, often referred to as a "server farm." This study provides a clear, visual comparison of two key algorithms, highlighting their operational differences and performance trade-offs.

### 1.1. Core Concepts

*   **Weighted Round Robin (WRR):** A static load balancing algorithm where servers are assigned "weights," typically representing their processing capacity. Requests are distributed in a cyclical sequence, but the number of requests directed to each server is proportional to its assigned weight.

*   **Consistent Hashing:** A dynamic load balancing algorithm that maps servers and requests onto a logical "ring" using a hash function. Requests are assigned to the next server found by traversing the ring clockwise. Its primary advantage is that when a server is added or removed, only a small fraction of keys are affected, minimizing disruption.

### 1.2. Objectives of the Study

The primary objectives of this project are:
1.  **To Implement and Simulate:** Develop a functional, interactive dashboard that accurately simulates the Weighted Round Robin algorithm for distributing network traffic.
2.  **To Visualize and Compare:** Provide a clear, real-time visualization of server load and traffic distribution, setting the stage for a future comparison with Consistent Hashing in terms of efficiency, fairness, and fault tolerance.
3.  **To Provide an Educational Platform:** Build an intuitive platform for understanding the fundamental principles and practical differences between static and dynamic load balancing strategies.

### 1.3. Significance

The significance of this project lies in its educational value. It offers a simplified yet powerful model of sophisticated load balancing techniques that are widely used in major cloud infrastructures (e.g., AWS, Google Cloud, Azure) and modern software systems. By making the abstract behavior of these algorithms visible and interactive, it serves as a practical learning tool for students and professionals in the field of distributed systems.

### 1.4. Related Works

The study of load balancing is a well-established field. This project builds upon foundational concepts explored in numerous academic and industry contexts:

*   One study by **Han et al. (2023)** proposed an improved A* algorithm, called Dynamic Lattice A* Route Planning (DLRP-A*), which utilized a dynamic grid division for routing, demonstrating the importance of dynamic adaptation in complex systems.
*   Pioneering research on **Consistent Hashing by Karger et al. at MIT** has been widely adopted in distributed databases such as Cassandra and Riak, proving its effectiveness in large-scale, dynamic environments.
*   Industry-standard software like **NGINX and HAProxy** provide practical, real-world implementations of both Weighted Round Robin and various hashing-based techniques for high-performance traffic management.

## 2. Materials and Methods

### 2.1. Algorithm Design
The project uses a simulation dashboard to visualize request distribution across server nodes.

**Weighted Round Robin (WRR) Pseudocode:**
```
Initialize server_list with (server_id, weight)
Create request_queue

while request_queue is not empty:
    for each server in server_list:
        assign 'weight' number of requests to server
        update server load
```

**Consistent Hashing Pseudocode:**
```
Initialize hash_ring
Add servers to hash_ring using hash(server_id)

for each incoming request:
    position = hash(request_id)
    server = find_next_server_clockwise(position)
    assign request to server
```
The simulation allows manual traffic injection and automated load testing to evaluate algorithm performance.

## 3. Results and Discussion
The WRR algorithm is expected to demonstrate fairness and simplicity in static environments, distributing requests proportionally to server capacity. However, it is hypothesized that when servers are added or removed, WRR will require recalculating weights and redistributing traffic, which can cause inefficiencies.

Consistent Hashing, by contrast, is expected to show resilience in dynamic environments. When servers change, only a small fraction of requests are expected to be remapped, ensuring stability and scalability. This makes it particularly suitable for cloud-native systems where elasticity is critical.

## 4. Conclusion and Recommendation
This project aims to highlight the strengths and limitations of WRR and Consistent Hashing. The expected outcome is that WRR is ideal for predictable, static environments, while Consistent Hashing excels in dynamic, scalable systems. Future work may extend the simulation to include hybrid approaches or integrate real-world traffic datasets for deeper analysis.
