import * as React from "react";
import { Routes, Route } from "react-router-dom";
// Views
import Components from "./views/Components";
import Home from "./views/Home";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/components" element={<Components />} />
      </Routes>
    </div>
  );
}

export default App;
