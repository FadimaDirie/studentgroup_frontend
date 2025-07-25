import { Switch, Route, useLocation, Redirect } from "wouter";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
// import Groups from "@/pages/groups";
import GroupDetail from "@/pages/group-detail";
import Tasks from "@/pages/tasks";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import UserManagement from "@/pages/user-management";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const [location] = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/groups" component={() => <ProtectedRoute component={GroupDetail} />} />
      <Route path="/groups/:id" component={() => <ProtectedRoute component={GroupDetail} />} />
      <Route path="/tasks" component={() => <ProtectedRoute component={Tasks} />} />
      <Route path="/user-management" component={() => <ProtectedRoute component={UserManagement} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}
