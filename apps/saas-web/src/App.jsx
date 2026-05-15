import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex h-screen items-center justify-center bg-slate-50">
              <h1 className="text-4xl font-bold text-slate-900">
                SaaS Dashboard Placeholder
              </h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
