import React from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import "./App.css";

import Footer from "./componenets/Footer";
import Header from "./componenets/Header";
import ChatHistory from "./componenets/ChatHistory";
import ChatBox from "./componenets/ChatBox";

const App = () => {
  return (
    <Provider store={store}>
      <Header />
      <main>
        <ChatHistory />
        <ChatBox />
      </main>
      <Footer />
    </Provider>
  );
};

export default App;
