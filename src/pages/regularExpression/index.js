import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Button,
  Tooltip,
  Divider,
  withStyles
} from "@material-ui/core";
import {
  RemoveOutlined as RemoveOutlinedIcon,
  AddOutlined as AddOutlinedIcon,
  ArrowBack as ArrowBackIcon
} from "@material-ui/icons";
import {
  container,
  input,
  button,
  buttonBack,
  title,
  header,
  main,
  item,
  footer,
  divider,
} from "./styles";

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#4F4F4F",
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: theme.typography.pxToRem(20),
    border: "1px solid 	#4F4F4F",
    padding: "15px",
  },
}))(Tooltip);

export default function RegularExpression() {
  const [userInput, setUserInput] = useState("");
  const [inputs, setInputs] = useState([1]);

  const validate = (e) => {
    const regex = new RegExp(userInput);
    const string = e.target.value;

    if (regex.exec(string)) e.target.style.borderColor = "ForestGreen";
    else e.target.style.borderColor = "FireBrick";
  };

  useEffect(() => {
    const validateAll = () => {
      try {
        Array.from(
          document.querySelectorAll("input[class='expressionTesting']")
        ).map((elem) => {
          const string = elem.value;
          const regex = new RegExp(userInput);

          if (regex.exec(string)) elem.style.borderColor = "ForestGreen";
          else elem.style.borderColor = "FireBrick";
        });
      } catch (error) {
        console.error(error);
      }
    };
    validateAll();
  }, [userInput]);

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

      <p style={title}>Expressão regular</p>
    </header>

      <div style={main}>
        <input
          type="text"
          onChange={(e) => {
            setUserInput(e.target.value);
          }}
          style={input}
        />
      </div>

      <Divider style={divider} />

      <div style={main}>
        {inputs.map(() => (
          <div style={item}>
            <input
              className="expressionTesting"
              type="text"
              onChange={(e) => validate(e)}
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
            <AddOutlinedIcon
              color="action"
              style={{ fontSize: "3.0rem" }}
            />{" "}
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
            <RemoveOutlinedIcon
              color="action"
              style={{ fontSize: "3.0rem" }}
            />{" "}
          </Button>
        </Tooltip>
      </div>
    </Container>
  );
}
