# 🧠 Hybrid AI Engine: Tic-Tac-Toe

A state-of-the-art implementation of Game Theory and Machine Learning in a web-based environment.

## 🚀 Technical Deep Dive
### 1. Deterministic AI (Minimax + Alpha-Beta Pruning)
Instead of a brute-force approach, this engine utilizes **Alpha-Beta Pruning** to optimize the recursive search tree.
* **Logic:** It mathematically proves which branches of the decision tree will *not* lead to a better outcome and "prunes" (cuts) them off.
* **Result:** This reduces the computational complexity significantly, allowing the AI to reach an optimal decision in milliseconds without exhaustively checking every distinct node.

### 2. Probabilistic AI (Perceptron Learning)
A custom implementation of a **Single-Layer Perceptron** without external ML libraries.
* **Architecture:** Input nodes represent the board state, fed into a summation function with dynamic Weights ($W$) and Bias ($b$).
* **Training Loop:** The model utilizes a supervised learning approach (Gradient Descent logic) to adjust weights based on the error rate from provided CSV datasets, effectively "learning" strategy over time.
