import { RouterProvider } from "react-router-dom";
import { router } from "./Router";

// src/App.tsx
function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
