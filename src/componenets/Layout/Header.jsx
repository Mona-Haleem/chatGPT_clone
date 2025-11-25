const Header = ({ setShowHistory }) => {
  return (
    <header>
      <h1>ChatGPT Clone</h1>
      <button onClick={() => setShowHistory((show) => !show)}>☰</button>
    </header>
  );
};

export default Header;
