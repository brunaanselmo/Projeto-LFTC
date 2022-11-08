import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Button, Tooltip } from "@material-ui/core";
import {
  ArrowForward,
  RemoveOutlined as RemoveOutlinedIcon,
  AddOutlined as AddOutlinedIcon,
  ArrowBack as ArrowBackIcon,
} from "@material-ui/icons";
import {
  container,
  footer,
  button,
  buttonBack,
  header,
  title,
  main,
  item,
  input,
  input2,
} from "./styles";

const GrammarInput = ({ grammar, leftSide, rightSide, cont }) => {
  const [inputs, setInputs] = useState([leftSide, rightSide]);

  return (
    <div style={item}>
      <input
        value={inputs[0]}
        style={input2}
        onChange={(e) => {
          setInputs([e.target.value.toUpperCase(), inputs[1]]);
          grammar[cont].leftSide = e.target.value.toUpperCase();
          grammar[cont].rightSide = inputs[1];
        }}
        maxLength={1}
      />

      <ArrowForward color="action" />

      <input
        id={cont}
        value={inputs[1]}
        style={input}
        onChange={(e) => {
          setInputs([inputs[0], e.target.value]);
          grammar[cont].leftSide = inputs[0];
          grammar[cont].rightSide = e.target.value;
        }}
      />
    </div>
  );
};

export default function Gramatica() {
  let cont = 0;

  const [grammarInputs, setGrammarInputs] = useState([
    { leftSide: "S", rightSide: "aS | aB | λ" },
    { leftSide: "B", rightSide: "bB | λ" },
  ]);
  const [inputs, setInputs] = useState([1]);

  const validate = (strInput) => {
    const str = strInput.target.value;
    const arr = grammarInputs.map((input) => {
      const temp = { ...input };
      temp.rightSide = temp.rightSide.replace(/\s+/g, "").split("|");
      return temp;
    });
    const res = [];
    let type = "";
    arr.forEach((row) => {
      row.rightSide.forEach((rule) => {
        if (rule.length > 1) {
          if (rule.replace(/[^A-Z]/g, "").length > 1) {
            res.push("Invalid");
          } else {
            for (let i = 0; i < rule.length; i++) {
              if (rule[i] === rule[i].toUpperCase() && i === 0) {
                res.push("Left");
                break;
              }
              if (rule[i] === rule[i].toUpperCase() && i === rule.length - 1) {
                res.push("Right");
                break;
              }
            }
          }
        }
      });
    });

    if (res.filter((s) => s === "Right").length === res.length) {
      type = "Right";
    } else if (res.filter((s) => s === "Left").length === res.length) {
      type = "Left";
    } else {
      type = "Invalid";
    }

    if (type === "Right") {
      for (let rule of arr[0].rightSide) {
        if (matchD(str, rule, arr)) {
          strInput.target.style.borderColor = "ForestGreen";
          return;
        }
      }
      strInput.target.style.borderColor = "FireBrick";
    } else if (type === "Left") {
      for (let rule of arr[0].rightSide) {
        if (matchE(str, rule, arr)) {
          strInput.target.style.borderColor = "ForestGreen";
          return;
        }
      }
      strInput.target.style.borderColor = "FireBrick";
    } else {
      alert("Gramática inválida!");
      return;
    }
    return;
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
    if (
      rule.length > 1 &&
      rule.slice(0, rule.length - 1) !== str.slice(0, rule.length - 1)
    )
      return false;

    const rules = arr.find((row) => row.leftSide === nextRule);

    if (!rules) return false;
    for (let r of rules.rightSide) {
      if (matchD(str, rule.replace(nextRule, r), arr)) {
        return true;
      }
    }
  };

  const matchE = (str, rule, arr) => {
    if (rule.length - 1 > str.length) return false;
    const nextRule = rule[0];
    if (
      nextRule === "λ" &&
      rule.slice(1, rule.length) === str &&
      rule.slice(1, rule.length).length === str.length
    )
      return true;
    if (nextRule === nextRule.toLowerCase()) return rule === str;
    if (
      rule.length > 1 &&
      rule.slice(1, rule.length) !==
        str.slice(str.length - (rule.length - 1), str.length)
    )
      return false;

    const rules = arr.find((row) => row.leftSide === nextRule);

    if (!rules) return false;
    for (let r of rules.rightSide) {
      if (matchE(str, rule.replace(nextRule, r), arr)) {
        return true;
      }
    }
  };

  return (
    <Container maxWidth="lg" style={container}>
      <header style={header}>
        <Link style={buttonBack} to="/" width="20px" height="40px">
          <Tooltip title="Voltar">
            <Button style={buttonBack}>
              <ArrowBackIcon color="action" style={{ fontSize: "2.5rem" }} />
            </Button>
          </Tooltip>
        </Link>

        <p style={title}>Gramática regular</p>
      </header>

      <div style={{ width: "100%" }}>
        <div style={{ width: "50%", float: "left" }}>
          <div style={main}>
            {grammarInputs.map((input) => (
              <GrammarInput
                grammar={grammarInputs}
                leftSide={input.leftSide}
                rightSide={input.rightSide}
                cont={cont++}
              />
            ))}
          </div>
          <div style={footer}>
            <Tooltip title="Adicionar nova regra">
              <Button
                style={button}
                onClick={() => {
                  if (grammarInputs.length < 20)
                    setGrammarInputs([
                      ...grammarInputs,
                      { leftSide: "", rightSide: "" },
                    ]);
                }}
              >
                {" "}
                <AddOutlinedIcon color="action" />{" "}
              </Button>
            </Tooltip>
            <Tooltip title="Remover regra">
              <Button
                style={button}
                onClick={() => {
                  if (grammarInputs.length > 1)
                    setGrammarInputs(
                      grammarInputs.slice(0, grammarInputs.length - 1)
                    );
                }}
              >
                {" "}
                <RemoveOutlinedIcon color="action" />{" "}
              </Button>
            </Tooltip>
          </div>
        </div>

        <div style={{ width: "45%", float: "left" }}>
          <div style={main}>
            {inputs.map(() => (
              <div style={item}>
                <input
                  type="text"
                  placeholder="String"
                  onChange={(strInput) => validate(strInput)}
                  onClick={(strInput) => {
                    validate(strInput);
                    strInput.target.placeholder = "";
                  }}
                  style={input}
                />
              </div>
            ))}
          </div>
          <div style={footer}>
            <Tooltip title="Adicionar">
              <Button
                style={button}
                onClick={() => {
                  if (inputs.length < 5) setInputs([...inputs, 1]);
                }}
              >
                {" "}
                <AddOutlinedIcon color="action" />{" "}
              </Button>
            </Tooltip>
            <Tooltip title="Remover">
              <Button
                style={button}
                onClick={() => {
                  if (inputs.length > 1)
                    setInputs(inputs.slice(0, inputs.length - 1));
                }}
              >
                {" "}
                <RemoveOutlinedIcon color="action" />{" "}
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </Container>
  );
}
