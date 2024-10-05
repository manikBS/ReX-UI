 
import Auth from "./components/Auth";
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import App from "./components/App";
import { AppContainer } from "react-hot-loader";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./../stateManagement/store";

const title = "ReX TDE";

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Auth0Provider
          domain="dev-41qekrjvyae0eg14.us.auth0.com"
          clientId="oNcEIL2SaRx9h9JfFQ7Bzwgwvp22V90w"
          authorizationParams={{
            redirect_uri: window.location.origin + "/taskpane.html#/"
          }}
      >
        <Provider store={store}>
            <App title='ReX TDE' />
        </Provider>
      </Auth0Provider>
    </AppContainer>,
    document.getElementById("container")
  );
};

render();

if ((module as any).hot) {
  (module as any).hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    render();
  });
}
