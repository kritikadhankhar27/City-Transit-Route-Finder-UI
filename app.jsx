import React, { useState } from "react";

export default function App() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [route, setRoute] = useState([]);

  // Dummy graph
  const graph = {
    A: { B: 2, C: 5 },
    B: { A: 2, C: 3, D: 4 },
    C: { A: 5, B: 3, D: 2, E: 3 },
    D: { B: 4, C: 2, E: 1 },
    E: { C: 3, D: 1 },
  };

  const dijkstra = (start, end) => {
    const distances = {};
    const visited = {};
    const previous = {};
    const nodes = Object.keys(graph);

    nodes.forEach((node) => {
      distances[node] = Infinity;
      previous[node] = null;
    });
    distances[start] = 0;

    while (nodes.length) {
      nodes.sort((a, b) => distances[a] - distances[b]);
      const closest = nodes.shift();
      if (closest === end) break;

      for (let neighbor in graph[closest]) {
        if (visited[neighbor]) continue;
        const newDist = distances[closest] + graph[closest][neighbor];
        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          previous[neighbor] = closest;
        }
      }
      visited[closest] = true;
    }

    const path = [];
    let curr = end;
    while (curr) {
      path.unshift(curr);
      curr = previous[curr];
    }
    return path;
  };

  const findRoute = () => {
    if (!graph[source] || !graph[destination]) {
      alert("Invalid source or destination. Use A-E.");
      return;
    }
    const result = dijkstra(source, destination);
    setRoute(result);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-gradient-to-br from-gray-950 to-black text-white">
      <h1 className="text-4xl mb-8 font-bold bg-gradient-to-r from-purple-500 to-cyan-400 text-transparent bg-clip-text">
        🚍 City Transit Route Finder
      </h1>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-xl mb-10">
        <label className="block mb-2 text-sm text-gray-300">Source Stop:</label>
        <input
          value={source}
          onChange={(e) => setSource(e.target.value.toUpperCase())}
          placeholder="E.g. A"
          className="w-full p-3 mb-4 rounded-xl bg-gray-800/50 placeholder-gray-400 focus:outline-none"
        />

        <label className="block mb-2 text-sm text-gray-300">Destination Stop:</label>
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value.toUpperCase())}
          placeholder="E.g. E"
          className="w-full p-3 mb-6 rounded-xl bg-gray-800/50 placeholder-gray-400 focus:outline-none"
        />

        <button
          onClick={findRoute}
          className="w-full p-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 font-bold transition"
        >
          Find Best Route
        </button>
      </div>

      {route.length > 0 && (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-xl">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-emerald-400 text-transparent bg-clip-text">
            🗺️ Route Timeline
          </h2>
          <ol className="border-l-4 border-cyan-400 pl-6 space-y-4 relative">
            {route.map((stop, idx) => (
              <li key={idx} className="relative">
                <span className="absolute -left-3 top-0 w-4 h-4 bg-emerald-400 rounded-full shadow-lg"></span>
                <span className="text-lg">{stop}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </main>
  );
}
