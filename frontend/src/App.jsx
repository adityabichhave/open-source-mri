import RepoInput from "./components/RepoInput";

function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>Open Source MRI</h1>
          <p>See inside. Understand faster.</p>
        </div>
      </header>

      <main className="main-content">
        <RepoInput />
      </main>
    </div>
  );
}

export default App;