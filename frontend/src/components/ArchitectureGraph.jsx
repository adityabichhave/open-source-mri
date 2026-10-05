import { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState
} from "reactflow";

import dagre from "@dagrejs/dagre";

import "reactflow/dist/style.css";

const NODE_WIDTH = 190;
const NODE_HEIGHT = 50;

function createLayout(nodes, edges) {
  const graph = new dagre.graphlib.Graph();

  graph.setDefaultEdgeLabel(() => ({}));

  graph.setGraph({
    rankdir: "TB",
    ranksep: 80,
    nodesep: 50,
    marginx: 30,
    marginy: 30
  });

  nodes.forEach((node) => {
    graph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT
    });
  });

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  return nodes.map((node) => {
    const position = graph.node(node.id);

    return {
      ...node,
      position: {
        x: position.x - NODE_WIDTH / 2,
        y: position.y - NODE_HEIGHT / 2
      }
    };
  });
}

function ArchitectureGraph({ result }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const codeFlow = result.codeFlow || {};
  const sourceFiles = result.sourceFiles || [];

  const baseNodes = useMemo(() => {
    return (codeFlow.nodes || []).map((node) => ({
      ...node,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      data: {
        label: node.data?.label || node.id
      }
    }));
  }, [codeFlow.nodes]);

  const baseEdges = useMemo(() => {
    return (codeFlow.edges || []).map((edge) => ({
      ...edge,
      type: "smoothstep"
    }));
  }, [codeFlow.edges]);

  const layoutedNodes = useMemo(() => {
    return createLayout(baseNodes, baseEdges);
  }, [baseNodes, baseEdges]);

  const styledNodes = useMemo(() => {
    return layoutedNodes.map((node) => {
      const selectedId = selectedFile?.path;

      const connected =
        selectedId &&
        baseEdges.some(
          (edge) =>
            (edge.source === selectedId &&
              edge.target === node.id) ||
            (edge.target === selectedId &&
              edge.source === node.id)
        );

      return {
        ...node,
        style: {
          width: NODE_WIDTH,
          minHeight: NODE_HEIGHT,
          border:
            node.id === selectedId
              ? "2px solid #2563eb"
              : connected
              ? "2px solid #60a5fa"
              : "1px solid #d4d4d8",
          background:
            node.id === selectedId
              ? "#eff6ff"
              : connected
              ? "#f8fbff"
              : "#ffffff",
          borderRadius: "8px",
          padding: "8px",
          fontSize: "11px",
          fontWeight: 500
        }
      };
    });
  }, [layoutedNodes, selectedFile, baseEdges]);

  const styledEdges = useMemo(() => {
    const selectedId = selectedFile?.path;

    return baseEdges.map((edge) => {
      const highlighted =
        edge.source === selectedId ||
        edge.target === selectedId;

      return {
        ...edge,
        animated: highlighted,
        style: {
          stroke: highlighted ? "#2563eb" : "#b4b4b4",
          strokeWidth: highlighted ? 2.5 : 1.2
        }
      };
    });
  }, [baseEdges, selectedFile]);

  const [nodes, setNodes, onNodesChange] =
    useNodesState(styledNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(styledEdges);

  // Update React Flow when the selected node changes.
  const refreshGraph = useCallback(() => {
    setNodes(styledNodes);
    setEdges(styledEdges);
  }, [styledNodes, styledEdges, setNodes, setEdges]);

  useMemo(() => {
    refreshGraph();
  }, [refreshGraph]);

  function handleNodeClick(event, node) {
    const file = sourceFiles.find(
      (item) => item.path === node.id
    );

    setSelectedFile(file || null);
  }

  return (
    <section className="architecture-graph-section">
      <div className="section-title">
        <h3>Code Flow</h3>
      </div>

      {nodes.length > 0 ? (
        <>
          <div className="architecture-graph">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={handleNodeClick}
              fitView
              fitViewOptions={{
                padding: 0.2
              }}
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>

          {selectedFile && (
            <div className="selected-file">
              <div className="selected-file-header">
                <strong>{selectedFile.path}</strong>

                <button
                  onClick={() => setSelectedFile(null)}
                >
                  Close
                </button>
              </div>

              <pre>{selectedFile.content}</pre>
            </div>
          )}
        </>
      ) : (
        <div className="empty-graph">
          No source-code relationships detected yet.
        </div>
      )}
    </section>
  );
}

export default ArchitectureGraph;