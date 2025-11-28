# Dynamic Traffic Orchestration: A Comparative Study of Server Load Balancing

This project is an interactive simulation environment built with Next.js that visualizes and compares two fundamental server load balancing algorithms: **Weighted Round Robin (WRR)** and **Consistent Hashing (CH)**.

The application provides a hands-on dashboard for understanding how network traffic is distributed across a set of server nodes, highlighting the trade-offs between static and dynamic load balancing strategies. It also features an integrated AI assistant, **HADES**, to provide guidance and context about the simulation.

---

## Key Features

*   **Algorithm Simulation:** Switch between Weighted Round Robin and Consistent Hashing in real-time to observe their distinct behaviors.
*   **Interactive Visualization:** A dynamic grid of server nodes displays current load, capacity, and status, with visual cues for warnings and overloads.
*   **Traffic Injection:** Manually inject single or multiple user requests, or enable an auto-injector to simulate continuous traffic flow.
*   **Dynamic Server Management:** Add or remove server nodes and adjust weights (for WRR) to see how each algorithm adapts to a changing environment.
*   **AI Assistant (HADES):** An in-context AI assistant powered by Google Gemini that can answer questions about the simulation, load balancing concepts, and the project's architecture.
*   **System Logs:** A real-time log panel displays every event, from request assignments to server configuration changes.

## Technology Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [ShadCN/UI](https://ui.shadcn.com/)
*   **Generative AI:** [Genkit (Google AI)](https://firebase.google.com/docs/genkit)
*   **Icons:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## Getting Started

To run the development server:

```bash
npm run dev
```

This will start the Next.js application, typically on port `9002`. Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

The main application logic can be found in `src/app/page.tsx`. The load balancing algorithms are implemented in `src/lib/wrr.ts` and `src/lib/ch.ts`. The AI assistant's logic and prompts are located in `src/ai/flows/hades-flow.ts`.
