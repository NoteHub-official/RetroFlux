import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";
import "./index.scss";
import "./prism.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ColorModeScript />
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
