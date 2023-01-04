/* eslint-disable array-callback-return */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Graph } from "react-d3-graph";
import {
  Typography,
  Tooltip,
  withStyles,
  Button,
  Divider,
  Container,
} from "@material-ui/core";
import {
  AddOutlined as AddOutlinedIcon,
  ArrowBack as ArrowBackIcon,
  HelpOutline as HelpOutlineIcon,
  RemoveOutlined as RemoveOutlinedIcon,
  Delete,
} from "@material-ui/icons";
import {
  divider,
  input,
  inputNo,
  helper,
  footer,
  container,
  header,
  title,
  button,
  buttonBack,
  divAddNo,
  divInput,
  text,
  main,
  divGraph,
  box
} from "./styles";

const Config = {
  nodeHighlightBehavior: true,
  linkHighlightBehavior: true,
  directed: true,
  maxZoom: 7,
  width: 850,
  height: 450,
  node: {
    color: "grey",
    size: 900,
    highlightStrokeColor: "blue",
    highlightFontSize: 12,
    highlightFontWeight: "bold",
    labelPosition: "center",
    fontSize: 12,
    fontColor: "white",
    fontWeight: "bold",
  },
  link: {
    color: "black",
    strokeWidth: 2,
    highlightColor: "lightblue",
    highlightFontSize: 12,
    renderLabel: true,
    fontSize: 12,
    fontWeight: "bold",
    strokeLinecap: "round",
  },
};

export default function FiniteAutomaton() {
  const [nodes, setNodes] = useState([
    { id: "q0", color: "black" },
    { id: "q1", color: "blue" },
    { id: "q2", color: "blue" },
  ]);
  const [transitions, setTransitions] = useState([
    { source: "q0", target: "q1", label: "a" },
    { source: "q0", target: "q2", label: "b" },
  ]);
  const [transitionInput, setTransitionInput] = useState({
    source: "",
    target: "",
    label: "λ",
  });
  const [deleteMode, setDeleteMode] = useState(false);
  const [inputs, setInputs] = useState([1]);

  const onClickNode = (nodeId) => {
    if (deleteMode) {
      setTransitions(
        transitions.filter((t) => t.source !== nodeId && t.target !== nodeId)
      );
      setNodes(nodes.filter((node) => node.id !== nodeId));
    } else {
      setNodes(
        nodes.map((node) => {
          if (node.id === nodeId) {
            if (node.color === "blue") node.color = "grey";
            else node.color = "blue";
          }
          return node;
        })
      );
    }
  };

  const onClickLink = (source, target) => {
    if (deleteMode)
      setTransitions(
        transitions.filter((t) => t.source !== source || t.target !== target)
      );
  };

  const validate = async (strInput) => {
    let charCode = 65;
    const str = strInput.target.value;
    let tempTransitionsWithoutFormat = [];
    let tempTransitions = [];
    let tempNodes = [];
    transitions.forEach((tr) =>
      tempTransitionsWithoutFormat.push(Object.assign({}, tr))
    );
    nodes.forEach((node) => tempNodes.push(Object.assign({}, node)));

    await Promise.all(
      tempTransitionsWithoutFormat.map((tr) => {
        tr.label.split("\n").map((item) => {
          const label = item.trim();
          tempTransitions.push({
            source: tr.source,
            target: tr.target,
            label,
          });
        });
      })
    );

    console.log(tempTransitions);
    tempNodes = tempNodes.map((node) => {
      const newValue = String.fromCharCode(charCode);
      tempTransitions.map((tr) => {
        if (tr.source === node.id) tr.source = newValue;
        if (tr.target === node.id) tr.target = newValue;
      });
      node.id = newValue;
      let type = [];
      if (node.symbolType === "diamond") type.push("initial");
      if (node.color === "blue") type.push("final");
      node.type = type;
      charCode += 1;
      return node;
    });

    let grammar = [];
    for (let i = 0; i < tempTransitions.length; i++) {
      let initial = tempTransitions[i].source;
      let final = tempTransitions[i].target;
      let value = tempTransitions[i].label;

      let rules = grammar.find((row) => row.leftSide === initial);

      if (!rules) {
        if (value === "λ")
          grammar.push({ leftSide: initial, rightSide: [final] });
        else grammar.push({ leftSide: initial, rightSide: [value + final] });
      } else {
        if (value === "λ") rules.rightSide.push(final);
        else rules.rightSide.push(value + final);
      }
    }
    for (let i = 0; i < tempNodes.length; i++) {
      let initial = tempNodes[i].id;
      let type = tempNodes[i].type.find((row) => row === "final");
      if (type) {
        //Se é final
        let rules = grammar.find((row) => row.leftSide === initial);

        if (!rules)
          //Se não tem
          grammar.push({ leftSide: initial, rightSide: ["λ"] });
        //Se tem
        else rules.rightSide.push("λ");
      }
    }
    for (let i = 0; i < tempNodes.length; i++) {
      let initial = tempNodes[i].id;
      let type = tempNodes[i].type.find((row) => row === "initial");

      if (type) {
        let rules = grammar.find((row) => row.leftSide === initial); //Verificando se existe regra com aquele simbolo
        grammar = grammar.filter((item) => item !== rules);
        grammar.unshift(rules);
      }
    }
    console.log(transitions);
    console.log(grammar);
    for (let rule of grammar[0].rightSide) {
      if (matchD(str, rule, grammar)) {
        strInput.target.style.borderColor = "ForestGreen";
        return;
      }
    }
    strInput.target.style.borderColor = "FireBrick";
  };

  const matchD = (str, rule, arr) => {
    if (rule.length - 1 > str.length) return false;

    const nextRule = rule[rule.length - 1];

    if (
      nextRule === "λ" &&
      rule.slice(0, rule.length - 1) === str &&
      rule.slice(0, rule.length - 1).length === str.length
    )
      return true;

    if (nextRule === nextRule.toLowerCase()) return rule === str;

    const rules = arr.find((row) => row.leftSide === nextRule);

    if (!rules) return false;
    for (let r of rules.rightSide) {
      if (matchD(str, rule.replace(nextRule, r), arr)) {
        return true;
      }
    }
  };

  const addTransition = (transitionInput) => {
    const trEqual = transitions.find(
      (t) =>
        t.source === transitionInput.source &&
        t.target === transitionInput.target &&
        t.label === transitionInput.label
    );
    const trSameNode = transitions.find(
      (t) =>
        t.source === transitionInput.target &&
        t.target === transitionInput.source
    );
    const trSameNodeSameDirect = transitions.find(
      (t) =>
        t.source === transitionInput.source &&
        t.target === transitionInput.target
    );

    if (!trEqual)
      if (trSameNode) {
        setTransitions(
          transitions.filter(
            (t) =>
              t.source !== trSameNode.source && t.target !== trSameNode.target
          )
        );
        trSameNode.type = "CURVE_SMOOTH";
        transitionInput.type = "CURVE_SMOOTH";
        setTransitions([...transitions, trSameNode]);
        setTransitions([...transitions, transitionInput]);
      } else if (trSameNodeSameDirect) {
        setTransitions(
          transitions.filter(
            (t) =>
              t.source !== trSameNodeSameDirect.source &&
              t.target !== trSameNodeSameDirect.target
          )
        );
        trSameNodeSameDirect.label += ` \n ${transitionInput.label}`;
        setTransitions([...transitions, trSameNodeSameDirect]);
      } else setTransitions([...transitions, transitionInput]);
    else setTransitionInput({ source: "", target: "", label: "λ" });
  };

  return (
    <Container style={container}>
      <header style={header}>
        <Link style={buttonBack} to="/">
          <Tooltip title="Voltar">
            <Button>
              <ArrowBackIcon color="action" style={{ fontSize: "2.5rem" }} />
            </Button>
          </Tooltip>
        </Link>

        <p style={title}>Autômato Finito</p>
      </header>

      <div style={divAddNo}>
        <div style={divInput}>
          <label>Estado inicial</label>
          <input
            style={inputNo}
            value={transitionInput.source}
            onChange={(e) =>
              setTransitionInput({ ...transitionInput, source: e.target.value })
            }
          />
        </div>

        <div style={divInput}>
          <label>Estado final</label>
          <input
            style={inputNo}
            value={transitionInput.target}
            onChange={(e) =>
              setTransitionInput({ ...transitionInput, target: e.target.value })
            }
          />
        </div>

        <div style={divInput}>
          <label>Transição</label>
          <input
            style={inputNo}
            value={transitionInput.label}
            onChange={(e) =>
              setTransitionInput({ ...transitionInput, label: e.target.value })
            }
          />
        </div>

        <Button
          style={{ height: "40px", alignSelf: "flex-end", marginRight: "50px" }}
          variant="contained"
          color="white"
          onClick={() => addTransition(transitionInput)}
        >
          Adicionar transição
        </Button>

        <Button
          style={{ height: "40px", alignSelf: "flex-end", marginRight: "10px" }}
          variant="contained"
          color="white"
          onClick={() => {
            if (nodes.length > 0)
              setNodes([
                ...nodes,
                { id: `q${parseInt(nodes[nodes.length - 1].id[1]) + 1}` },
              ]);
            else setNodes([{ id: "q0", symbolType: "diamond" }]);
          }}
        >
          Adicionar estado
        </Button>

        <Button
          style={{ height: "40px", alignSelf: "flex-end" }}
          variant="contained"
          color={deleteMode ? "secondary" : "default"}
          onClick={() => setDeleteMode(!deleteMode)}
        >
          <Delete />
        </Button>
      </div>

      <div style = {{width: "800px", float: "right", marginLeft: "80%", marginTop: "-35px"}}>
             <p>
                {"ESTADO CINZA: estado normal"} <br />
                {"ESTADO AZUL: estado final"} <br />
                {"ESTADO PRETO: estado inicial"} <br />
                {"O primeiro estado inserido será"} <br/> {"considerado o estado inicial."} <br/>
                {"Para definir um estado como final,"} <br/> {"é preciso clicar nele."} 
             </p>
            </div>

      <div style={main}>
        <div style={divGraph}>
          <Graph
            id="graph-id"
            data={{
              nodes: nodes,
              links: transitions,
            }}
            config={Config}
            onClickNode={onClickNode}
            onClickLink={onClickLink}
          />
        </div>

        <div style={{ width: "fit-content", float: "right"}}>
          <p style={text}>Testar expressões</p>

          <div>
            {inputs.map(() => (
              <div>
                <input
                  type="text"
                  onChange={async (strInput) => await validate(strInput)}
                  onClick={async (strInput) => await validate(strInput)}
                  style={input}
                />
              </div>
            ))}
          </div>

          <div style={footer}>
            
          </div>
        </div>
      </div>
    </Container>
  );
}
