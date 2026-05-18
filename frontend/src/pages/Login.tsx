import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data } = await API.post("/auth/login", {
      email,
      password,
    });

    login(data.user, data.token);

    navigate("/");
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-white/45 bg-white/65 shadow-[0_40px_120px_-55px_rgba(15,23,42,0.55)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/45 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative flex flex-col justify-between overflow-hidden bg-[linear-gradient(135deg,#0f766e_0%,#164e63_55%,#082f49_100%)] p-8 text-white sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(251,191,36,0.18),transparent_26%)]" />
          <div className="relative space-y-6">
            <div className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              Smart Leads Management
            </div>
            <div className="space-y-4">
              <h1 className="max-w-lg text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Keep every lead visible, actionable, and moving.
              </h1>
              <p className="max-w-xl text-sm leading-6 text-white/76 sm:text-base">
                A calmer sales workspace for tracking conversations, qualifying opportunities,
                and giving your team one sharp view of pipeline health.
              </p>
            </div>
          </div>

         
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <Card className="w-full max-w-md border-white/50 bg-white/80 shadow-none dark:border-white/10 dark:bg-slate-950/60">
            <CardContent className="space-y-6 p-6 sm:p-8">
              <div className="space-y-2 text-center">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">
                  Welcome back
                </p>
                <h2 className="text-3xl font-semibold tracking-tight">
                  Sign in to your workspace
                </h2>
                <p className="text-sm text-muted-foreground">
                  Pick up where your team left off and keep the pipeline moving.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 rounded-xl bg-background/70 px-4"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-xl bg-background/70 px-4"
                  />
                </div>

                <Button type="submit" size="lg" className="h-11 w-full rounded-xl text-sm font-semibold">
                  Login
                  <ArrowRight />
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                New here?{" "}
                <Link to="/register" className="font-semibold text-primary hover:opacity-80">
                  Create an account
                </Link>
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Login;
