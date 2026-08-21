import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import BirthdayExperience from "./components/BirthdayExperience";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BirthdayExperience />
  </StrictMode>,
);
