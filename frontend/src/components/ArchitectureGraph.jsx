import { useEffect, useMemo, useState } from "react";

import { explainFile } from "../services/api";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState
} from "reactflow";

import { Network, Brain, X } from "lucide-react";

import dagre from "@dagrejs/dagre";

import "reactflow/dist/style.css";

const NODE_WIDTH = 320;
const NODE_HEIGHT = 82;


/* =========================================================
   NODE THEMES
========================================================= */

function getNodeTheme(path) {
  const lower = path.toLowerCase();

  if (
    lower.endsWith(".tsx") ||
    lower.endsWith(".jsx")
  ) {
    return {
      accent: "#4169ff",
      background: "#f1f4ff",
      icon: "⚛"
    };
  }

  if (
    lower.endsWith(".ts") ||
    lower.endsWith(".js") ||
    lower.endsWith(".mjs") ||
    lower.endsWith(".cjs")
  ) {
    return {
      accent: "#e8a800",
      background: "#fff8df",
      icon: "JS"
    };
  }

  if (lower.endsWith(".css")) {
    return {
      accent: "#e94cff",
      background: "#fff0fc",
      icon: "#"
    };
  }

  if (lower.endsWith(".py")) {
    return {
      accent: "#3776ab",
      background: "#eef7ff",
      icon: "PY"
    };
  }

  if (lower.endsWith(".java")) {
    return {
      accent: "#e76f00",
      background: "#fff3e8",
      icon: "JV"
    };
  }

  return {
    accent: "#00a9d6",
    background: "#effcff",
    icon: "◇"
  };
}


/* =========================================================
   DAGRE LAYOUT
========================================================= */

function createLayout(nodes, edges) {
  const graph = new dagre.graphlib.Graph();

  graph.setDefaultEdgeLabel(() => ({}));

  graph.setGraph({
    rankdir: "LR",
    ranksep: 110,
    nodesep: 70,
    marginx: 50,
    marginy: 50
  });

  nodes.forEach((node) => {
    graph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT
    });
  });

  edges.forEach((edge) => {
    graph.setEdge(
      edge.source,
      edge.target
    );
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


/* =========================================================
   ARCHITECTURE GRAPH
========================================================= */

function ArchitectureGraph({ result }) {

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [aiExplanation, setAiExplanation] =
    useState("");

  const [aiLoading, setAiLoading] =
    useState(false);

  // FIX:
  // This state was being used by handleExplainFile()
  // but was missing from the original component.
  const [aiStatus, setAiStatus] =
    useState("idle");


  const codeFlow = result.codeFlow || {};

  const sourceFiles =
    result.sourceFiles || [];


  /* =====================================================
     BASE NODES
  ===================================================== */

  const baseNodes = useMemo(() => {
    return (codeFlow.nodes || []).map(
      (node) => ({
        ...node,
        width: NODE_WIDTH,
        height: NODE_HEIGHT
      })
    );
  }, [codeFlow.nodes]);


  /* =====================================================
     BASE EDGES
  ===================================================== */

  const baseEdges = useMemo(() => {
    return (codeFlow.edges || []).map(
      (edge) => ({
        ...edge,
        type: "smoothstep"
      })
    );
  }, [codeFlow.edges]);


  /* =====================================================
     IMPACT ANALYSIS
  ===================================================== */

  const impactAnalysis = useMemo(() => {

    if (!selectedFile) {
      return null;
    }

    const filePath =
      selectedFile.path;


    /*
      source === selected file
      means this file points to / uses another file.
    */

    const dependencies = baseEdges
      .filter(
        (edge) =>
          edge.source === filePath
      )
      .map(
        (edge) =>
          edge.target
      );


    /*
      target === selected file
      means another file points to / uses this file.
    */

    const dependents = baseEdges
      .filter(
        (edge) =>
          edge.target === filePath
      )
      .map(
        (edge) =>
          edge.source
      );


    const uniqueDependencies =
      [...new Set(dependencies)];

    const uniqueDependents =
      [...new Set(dependents)];


    const dependencyCount =
      uniqueDependencies.length;

    const dependentCount =
      uniqueDependents.length;


    /*
      Dependents are weighted more heavily
      because changing a widely-used file
      can affect more of the application.
    */

    const impactScore =
      dependencyCount +
      dependentCount * 2;


    let risk = "LOW";

    if (impactScore >= 6) {
      risk = "HIGH";
    } else if (impactScore >= 3) {
      risk = "MEDIUM";
    }


    return {
      dependencies:
        uniqueDependencies,

      dependents:
        uniqueDependents,

      dependencyCount,

      dependentCount,

      impactScore,

      risk
    };

  }, [
    selectedFile,
    baseEdges
  ]);


  /* =====================================================
     LAYOUT
  ===================================================== */

  const layoutedNodes = useMemo(
    () =>
      createLayout(
        baseNodes,
        baseEdges
      ),
    [
      baseNodes,
      baseEdges
    ]
  );


  /* =====================================================
     STYLED NODES
  ===================================================== */

  const styledNodes = useMemo(() => {

    const selectedId =
      selectedFile?.path;


    return layoutedNodes.map(
      (node) => {

        const theme =
          getNodeTheme(node.id);


        const connected =
          selectedId &&
          baseEdges.some(
            (edge) =>
              (
                edge.source === selectedId &&
                edge.target === node.id
              ) ||
              (
                edge.target === selectedId &&
                edge.source === node.id
              )
          );


        return {
          ...node,

          data: {
            ...node.data,
            label: node.id
          },

          style: {

            width:
              NODE_WIDTH,

            height:
              NODE_HEIGHT,


            border:
              node.id === selectedId
                ? `3px solid ${theme.accent}`
                : connected
                ? `2px solid ${theme.accent}`
                : "1px solid #cbd5e1",


            borderLeft:
              node.id === selectedId
                ? `7px solid ${theme.accent}`
                : `5px solid ${theme.accent}`,


            background:
              node.id === selectedId
                ? theme.background
                : "#ffffff",


            borderRadius:
              "6px",


            padding:
              "12px 14px",


            fontFamily:
              '"Space Mono", monospace',


            fontSize:
              "14px",

            fontWeight:
              800,

            lineHeight:
              "1.4",

            letterSpacing:
              "-0.2px",

            overflow:
              "hidden",

            textOverflow:
              "ellipsis",

            whiteSpace:
              "nowrap",

            color:
              "#172033",


            boxShadow:
              node.id === selectedId
                ? `5px 5px 0 ${theme.accent}55`
                : "3px 3px 0 #dce2eb",


            transition:
              "0.15s ease"
          }
        };
      }
    );

  }, [
    layoutedNodes,
    selectedFile,
    baseEdges
  ]);


  /* =====================================================
     STYLED EDGES
  ===================================================== */

  const styledEdges = useMemo(() => {

    const selectedId =
      selectedFile?.path;


    return baseEdges.map(
      (edge) => {

        const highlighted =
          edge.source === selectedId ||
          edge.target === selectedId;


        return {
          ...edge,

          animated:
            highlighted,

          style: {

            stroke:
              highlighted
                ? "#4169ff"
                : "#9aa4b5",

            strokeWidth:
              highlighted
                ? 3
                : 1.4
          }
        };
      }
    );

  }, [
    baseEdges,
    selectedFile
  ]);


  /* =====================================================
     REACT FLOW STATE
  ===================================================== */

  const [
    nodes,
    setNodes,
    onNodesChange
  ] = useNodesState(
    styledNodes
  );


  const [
    edges,
    setEdges,
    onEdgesChange
  ] = useEdgesState(
    styledEdges
  );


  useEffect(() => {

    setNodes(
      styledNodes
    );

    setEdges(
      styledEdges
    );

  }, [
    styledNodes,
    styledEdges,
    setNodes,
    setEdges
  ]);


  /* =====================================================
     NODE CLICK
  ===================================================== */

  function handleNodeClick(
    event,
    node
  ) {

    const file =
      sourceFiles.find(
        (item) =>
          item.path === node.id
      );


    setSelectedFile(
      file || null
    );


    /*
      Reset previous AI explanation
      whenever another file is selected.
    */

    setAiExplanation("");

    setAiStatus("idle");
  }


  /* =====================================================
     AI FILE EXPLANATION
  ===================================================== */

  async function handleExplainFile() {

    if (!selectedFile) {
      return;
    }

    try {

      setAiLoading(true);

      setAiStatus("analyzing");

      setAiExplanation("");


      const response =
        await explainFile(
          selectedFile.path,
          selectedFile.content
        );


      const explanation =
        response?.explanation ||
        "No AI explanation was returned.";


      setAiExplanation(
        explanation
      );


      /*
        Detect Gemini quota fallback.
      */

      if (
        explanation.toLowerCase().includes("quota") ||
        explanation.toLowerCase().includes(
          "temporarily unavailable"
        ) ||
        explanation.toLowerCase().includes(
          "daily request"
        )
      ) {

        setAiStatus(
          "fallback"
        );

      } else {

        setAiStatus(
          "success"
        );

      }

    } catch (error) {

      console.error(
        "AI file analysis failed:",
        error
      );

      setAiStatus(
        "error"
      );

      setAiExplanation(
        error.message ||
        "AI analysis failed."
      );

    } finally {

      setAiLoading(
        false
      );
    }
  }


  /* =====================================================
     CLOSE INSPECTOR
  ===================================================== */

  function closeInspector() {

    setSelectedFile(
      null
    );

    setAiExplanation(
      ""
    );

    setAiLoading(
      false
    );

    setAiStatus(
      "idle"
    );
  }


  /* =====================================================
     UI
  ===================================================== */

  return (

    <section className="architecture-graph-section">


      {/* =================================================
          CODE FLOW HEADER
      ================================================= */}

      <div className="code-flow-header">

        <div>

          <div className="section-title">

            <div className="section-icon purple">

              <Network size={16} />

            </div>


            <div>

              <h3>
                CODE FLOW
              </h3>


              <p>
                Trace how files connect and
                discover the project's internal
                structure.
              </p>

            </div>

          </div>

        </div>


        <div className="graph-legend">

          <span>
            <i className="legend-dot selected" />
            Selected
          </span>

          <span>
            <i className="legend-dot connected" />
            Connected
          </span>

          <span>
            <i className="legend-dot file" />
            File
          </span>

        </div>

      </div>


      {/* =================================================
          GRAPH
      ================================================= */}

      {nodes.length > 0 ? (

        <>

          <div className="architecture-graph">

            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={
                onNodesChange
              }
              onEdgesChange={
                onEdgesChange
              }
              onNodeClick={
                handleNodeClick
              }

              defaultViewport={{
                x: 0,
                y: 0,
                zoom: 0.85
              }}

              minZoom={0.55}
              maxZoom={1}

              zoomOnScroll={false}
              zoomOnDoubleClick={false}

              panOnScroll={false}
              preventScrolling={false}

              panOnDrag={true}
            >

              <Background
                color="#d9e1ee"
                gap={20}
                size={1}
              />

              <Controls
                showZoom={true}
                showFitView={false}
                showInteractive={false}
              />

              <MiniMap
                nodeColor={(node) =>
                  getNodeTheme(
                    node.id
                  ).accent
                }
              />

            </ReactFlow>


            <div className="graph-corner-label">
              MRI / CODE MAP
            </div>

          </div>


          {/* =================================================
              FILE INSPECTOR
          ================================================= */}

          {selectedFile && (

            <div className="selected-file">


              {/* =============================================
                  INSPECTOR HEADER
              ============================================= */}

              <div className="selected-file-header">

                <div>

                  <span className="file-inspector-label">
                    FILE INSPECTOR
                  </span>


                  <strong>
                    {selectedFile.path}
                  </strong>

                </div>


                <div className="file-inspector-actions">

                  <button
                    onClick={
                      handleExplainFile
                    }
                    disabled={
                      aiLoading
                    }
                  >

                    <Brain size={14} />

                    {aiLoading
                      ? "ANALYZING..."
                      : "EXPLAIN WITH AI"}

                  </button>


                  <button
                    onClick={
                      closeInspector
                    }
                  >

                    <X size={14} />

                    CLOSE

                  </button>

                </div>

              </div>


              {/* =============================================
                  IMPACT ANALYSIS
              ============================================= */}

              {impactAnalysis && (

                <div className="impact-analysis">

                  <div className="impact-analysis-header">

                    <div>

                      <span className="file-inspector-label">
                        IMPACT ANALYSIS
                      </span>


                      <strong>
                        Dependency & Change Risk
                      </strong>

                    </div>


                    <div
                      className={
                        `impact-risk ${impactAnalysis.risk.toLowerCase()}`
                      }
                    >
                      {impactAnalysis.risk}
                    </div>

                  </div>


                  {/* =========================================
                      IMPACT STATS
                  ========================================= */}

                  <div className="impact-stats">

                    <div className="impact-stat">

                      <span>
                        DEPENDENCIES
                      </span>

                      <strong>
                        {
                          impactAnalysis.dependencyCount
                        }
                      </strong>

                    </div>


                    <div className="impact-stat">

                      <span>
                        DEPENDENTS
                      </span>

                      <strong>
                        {
                          impactAnalysis.dependentCount
                        }
                      </strong>

                    </div>


                    <div className="impact-stat">

                      <span>
                        IMPACT SCORE
                      </span>

                      <strong>
                        {
                          impactAnalysis.impactScore
                        }
                      </strong>

                    </div>

                  </div>


                  {/* =========================================
                      DEPENDENCY LISTS
                  ========================================= */}

                  <div className="impact-columns">


                    {/* DEPENDENCIES */}

                    <div>

                      <span className="impact-list-title">
                        THIS FILE USES
                      </span>


                      {impactAnalysis.dependencies.length > 0 ? (

                        <ul>

                          {
                            impactAnalysis.dependencies.map(
                              (file) => (

                                <li key={file}>
                                  {file}
                                </li>

                              )
                            )
                          }

                        </ul>

                      ) : (

                        <p>
                          No detected dependencies.
                        </p>

                      )}

                    </div>


                    {/* DEPENDENTS */}

                    <div>

                      <span className="impact-list-title">
                        USED BY
                      </span>


                      {impactAnalysis.dependents.length > 0 ? (

                        <ul>

                          {
                            impactAnalysis.dependents.map(
                              (file) => (

                                <li key={file}>
                                  {file}
                                </li>

                              )
                            )
                          }

                        </ul>

                      ) : (

                        <p>
                          No detected dependents.
                        </p>

                      )}

                    </div>

                  </div>


                  {/* =========================================
                      RISK MESSAGE
                  ========================================= */}

                  <div className="impact-message">

                    {
                      impactAnalysis.risk === "HIGH"

                        ? "Changing this file may affect multiple parts of the project."

                        : impactAnalysis.risk === "MEDIUM"

                        ? "Changes to this file may affect connected parts of the project."

                        : "This file has relatively limited dependency impact."
                    }

                  </div>

                </div>

              )}


              {/* =================================================
                  AI FILE AUTOPSY
              ================================================= */}

              <div className="file-ai-panel">

                <div className="file-ai-header">

                  <div>

                    <Brain size={17} />

                    <div>

                      <strong>
                        FILE AUTOPSY
                      </strong>

                      <span>
                        {aiStatus === "analyzing"
                          ? "AI IS ANALYZING THIS FILE..."
                          : aiStatus === "success"
                          ? "AI ANALYSIS COMPLETE"
                          : aiStatus === "fallback"
                          ? "AI QUOTA UNAVAILABLE — MRI ANALYSIS"
                          : aiStatus === "error"
                          ? "AI ANALYSIS FAILED"
                          : "READY FOR ANALYSIS"}
                      </span>

                    </div>

                  </div>


                  {aiStatus === "success" && (

                    <span className="ai-status success">
                      AI READY
                    </span>

                  )}


                  {aiStatus === "fallback" && (

                    <span className="ai-status fallback">
                      MRI MODE
                    </span>

                  )}


                  {aiStatus === "error" && (

                    <span className="ai-status error">
                      ERROR
                    </span>

                  )}

                </div>


                {aiStatus === "idle" &&
                  !aiExplanation && (

                    <div className="file-ai-empty">

                      <Brain size={28} />

                      <div>

                        <strong>
                          Understand this file
                        </strong>

                        <p>
                          Click EXPLAIN WITH AI to
                          analyze this file's purpose,
                          responsibilities and role
                          in the architecture.
                        </p>

                      </div>

                    </div>

                  )}


                {aiStatus === "analyzing" && (

                  <div className="file-ai-loading">

                    <div className="ai-loading-line" />

                    <div className="ai-loading-line short" />

                    <div className="ai-loading-line" />

                    <span>
                      Reading source code and
                      generating explanation...
                    </span>

                  </div>

                )}


                {aiExplanation && (
  <div className="file-ai-result">
    <pre>{aiExplanation}</pre>
  </div>
)}

              </div>


              {/* =================================================
                  SOURCE CODE
              ================================================= */}

              <div className="source-code-header">

                <span>
                  SOURCE CODE
                </span>

                <span>
                  {
                    selectedFile.content
                      .split("\n")
                      .length
                  } lines
                </span>

              </div>


              <pre>
                {selectedFile.content}
              </pre>


            </div>

          )}

        </>

      ) : (

        <div className="empty-graph">

          No source-code relationships
          detected yet.

        </div>

      )}

    </section>
  );
}

export default ArchitectureGraph;