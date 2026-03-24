import { GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router"; // 👈 Add Outlet
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";

import { Layout } from "./components/refine-ui/layout/layout"; // 👈 point directly to layout.tsx
// ...existing code...; // 👈 Add Layout import
import { dataProvider } from "./providers/data";
import Dashboard from "./pages/Dashboard";
import { BookOpen, Home } from "lucide-react";
import { SubjectsList } from "./pages/subjects/list";
import { SubjectsCreate } from "./pages/subjects/create";

function App() {
  return (
    <BrowserRouter>
      
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "nDtJWk-txouny-uJIwg4",
              }}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: { label: "Home", icon: <Home /> },
                },
                {
                  name: "subjects",
                  list: "/subjects",
                  create: "/subjects/create",
                  meta: { label: "Subjects",icon:<BookOpen/> }
                }
              ]}
            >
              <Routes>
                <Route element={<Layout><Outlet /></Layout>}> {/* 👈 Layout wraps all routes */}
                  <Route path="/" element={<Dashboard />} /> {/* 👈 Nested inside Layout */}
                  <Route path="subjects" > 
                    <Route index element={<SubjectsList />} /> {/* 👈 List route */}
                    <Route path="create" element={<SubjectsCreate />} /> {/* 👈 Create route */}
                  </Route>
                </Route>
              </Routes>
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;