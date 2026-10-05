import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap
} from "reactflow";
import "reactflow/dist/style.css";

function ArchitectureGraph({ result }) {
  const nodes = useMemo(() => {
    const architecture = result.architecture || {};

    const generatedNodes = [
      {
        id: "repo",
        position: { x: 250, y: 0 },
        data: {
          label: result.repository.name
        }
      }
    ];

    let y = 120;

    Object.entries(architecture).forEach(([key, value]) => {
      if (!value) return;

      generatedNodes.push({
        id: key,
        position: { x: 250, y },
        data: {
          label: `${key}: ${value}`
        }
      });

      y += 100;
    });

    return generatedNodes;
  }, [result]);

  const edges = useMemo(() => {
    const architecture = result.architecture || {};

    return Object.entries(architecture)
      .filter(([, value]) => value)
      .map(([key]) => ({
        id: `repo-${key}`,
        source: "repo",
        target: key,
        animated: true
      }));
  }, [result]);

  return (
    <section className="architecture-graph-section">
      <div className="section-title">
        <h3>Architecture Map</h3>
      </div>

      <div className="architecture-graph">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </section>
  );
}

export default ArchitectureGraph;