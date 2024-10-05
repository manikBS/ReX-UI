import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import Header from "./Header";
import { rexThemeSpec } from "../rexTheme.js";
import Progress from "./Progress";
import TemplateBuilder from "./TemplateBuilder";
import { useSelector } from "react-redux";
import Templates from "./RexTemplate/Templates";
import Auth from "./Auth";

export interface AppProps {
  title: string;
}

const App: React.FC<AppProps> = (props) => {
  const { title } = props;
  const theme = createTheme(rexThemeSpec(Office.context===undefined || Office.context.host===undefined
      ?"Web"
      :Office.context.host));;
  const [isOfficeInitialised, setIsOfficeInitialised] = useState(false);
  
  useEffect(()=>{
    Office.onReady(()=> {
      setIsOfficeInitialised(true);
    });
  })

  if (!isOfficeInitialised) {
    return (
      <Progress
        title={title}
        logo={require("./../../../assets/logo-16.png")}
        message="Please sideload your addin to see app body."
      />
    );
  }

  return (
    <div className="ms-welcome">
      <ThemeProvider theme={theme}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<TemplateBuilder />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/builder" element={<TemplateBuilder />} />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </div>
  );
};

export default App;

