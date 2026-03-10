import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./styles/global.css";
import { NoticeProvider } from "./context/NoticeContext";
import { EventProvider } from "./context/EventContext";
import { TimetableProvider } from "./context/TimetableContext";
import { CourseProvider } from "./context/CourseContext";
import { FeedbackProvider } from "./context/FeedbackContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <NoticeProvider>
        <EventProvider>
          <TimetableProvider>
            <CourseProvider>
              <FeedbackProvider>
                <App />
              </FeedbackProvider>
            </CourseProvider>
          </TimetableProvider>
        </EventProvider>
      </NoticeProvider>
    </AuthProvider>
  </BrowserRouter>
);