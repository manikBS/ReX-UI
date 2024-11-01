import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import Progress from "./Progress";
import TemplateBuilder from "./TemplateBuilder";
import { rexThemeSpec } from "../rexTheme.js"
import { Provider } from "react-redux";
import { store } from "../../stateManagement/store";

const TdeApp: React.FC = () => {
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
        title="ReX TDE"
        logo={require("./../../../assets/logo-16.png")}
        message="Please sideload your addin to see app body."
      />
    );
  }

  return (
    <Provider store={store}>
      <div className="ms-welcome">
        <ThemeProvider theme={theme}>
          <TemplateBuilder />
        </ThemeProvider>
      </div>
    </Provider>
  );
};

export default TdeApp;

