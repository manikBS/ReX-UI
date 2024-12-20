import App from "./components/TdeApp";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "../stateManagement/store";

const render = () => {
  ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
    document.getElementById("root")
  );
};


