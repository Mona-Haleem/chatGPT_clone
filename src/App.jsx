import React, { useState } from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import "./App.css";

import ChatHistory from "./componenets/ChatHistory";
import ChatBox from "./componenets/ChatBox";
import Footer from "./componenets/Layout/Footer";
import Header from "./componenets/Layout/Header";

const App = () => {
  const [showHistory , setShowHistory] = useState(false)
  return (
    <Provider store={store}>
      <Header setShowHistory={setShowHistory}/>
      <main>
        <ChatHistory showHistory={showHistory} />
        <ChatBox />
      </main>
      <Footer />
    </Provider>
  );
};

export default App;
