import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "./signup";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — CareerForge Pro" }] }),
  component: Login,
});

function Login() {
  return <AuthShell mode="login" />;
}
