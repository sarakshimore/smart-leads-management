import { useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await API.post("/auth/register", formData);

    navigate("/login");
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-white/45 bg-white/65 shadow-[0_40px_120px_-55px_rgba(15,23,42,0.55)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/45 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <Card className="w-full max-w-md border-white/50 bg-white/80 shadow-none dark:border-white/10 dark:bg-slate-950/60">
            <CardContent className="space-y-6 p-6 sm:p-8">
              <div className="space-y-2 text-center">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">
                  Get started
                </p>
                <h2 className="text-3xl font-semibold tracking-tight">
                  Create your workspace access
                </h2>
                <p className="text-sm text-muted-foreground">
                  Set up a role and start organizing inbound leads with your team.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full name</label>
                  <Input
                    type="text"
                    placeholder="Avery Johnson"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="h-11 rounded-xl bg-background/70 px-4"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="avery@company.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-11 rounded-xl bg-background/70 px-4"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    placeholder="Choose a password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="h-11 rounded-xl bg-background/70 px-4"
                  />
                </div>

                <Button type="submit" size="lg" className="h-11 w-full rounded-xl text-sm font-semibold">
                  Register
                  <ArrowRight />
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-primary hover:opacity-80">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="relative flex flex-col justify-between overflow-hidden bg-[linear-gradient(160deg,#172554_0%,#312e81_45%,#0f766e_100%)] p-8 text-white sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.16),transparent_24%),radial-gradient(circle_at_80%_75%,rgba(253,224,71,0.16),transparent_28%)]" />
          <div className="relative space-y-6">
            <div className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              Team onboarding
            </div>
            <div className="space-y-4">
              <h1 className="max-w-lg text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Build a lead system your team actually enjoys using.
              </h1>
              <p className="max-w-xl text-sm leading-6 text-white/76 sm:text-base">
                Give admins oversight, give sales reps clarity, and make every new inquiry feel
                less chaotic from day one.
              </p>
            </div>
          </div>

          <div className="relative grid gap-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <div className="mb-3 flex items-center gap-3">
                <Sparkles className="size-5 text-amber-300" />
                <p className="font-medium">Clean handoff</p>
              </div>
              <p className="text-sm text-white/72">
                New leads, status tracking, and source visibility stay in one shared workflow.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <Users className="mb-3 size-5 text-cyan-200" />
                <p className="text-sm font-medium">Sales ready</p>
                <p className="mt-1 text-xs text-white/70">Daily queue stays easy to scan and update.</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <BriefcaseBusiness className="mb-3 size-5 text-emerald-200" />
                <p className="text-sm font-medium">Admin visibility</p>
                <p className="mt-1 text-xs text-white/70">Exports and controls stay close at hand.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Register;
