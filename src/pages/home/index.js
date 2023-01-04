import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button/Button";
import Container from "@material-ui/core/Container";

import { container, menu, title, text, button, link } from "./styles";

export default function Home() {
  return (
    <Container style={container}>
      <p style={title}>Trabalho de Linguagens Formais e Teoria da Computação</p>
      <div style={menu}>
        <Button style={button}>
          <Link style={link} to="/RegularExpression">
            Expressões regulares
          </Link>
        </Button>
        <Button style={button}>
          <Link style={link} to="/RegularGrammar">
            Gramáticas regulares
          </Link>
        </Button>
        <Button style={button}>
          <Link style={link} to="/FiniteAutomaton">
            Automatos Finitos
          </Link>
        </Button>

      </div>
      <p style={text}>Bruna Anselmo</p>
    </Container>
  );
}
