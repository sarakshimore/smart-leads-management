import { useEffect, useState } from "react";

import API from "../api/axios";

import Navbar from "../components/Navbar";
import LeadForm from "../components/LeadForm";
import LeadTable from "../components/LeadTable";
import Pagination from "../components/Pagination";

import type { Lead } from "../types/lead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  FileSpreadsheet,
  LayoutDashboard,
  Target,
  UsersRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { user } = useAuth();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [source, setSource] = useState("");
    const [sort, setSort] = useState("latest");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchLeads = async () => {
        try {
            setError("");
            const { data } = await API.get(
                `/leads?page=${currentPage}&search=${search}&status=${status}&source=${source}&sort=${sort}`
            );

            setLeads(data.data);
            setCurrentPage(data.pagination.currentPage);
            setTotalPages(data.pagination.totalPages);
        } catch (err) {
            setLeads([]);
            setError("Unable to load leads. Please log in again.");
        }
    };

    const exportCSV = async () => {
        try {
            const response = await API.get("/leads/export/csv", {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link = document.createElement("a");

            link.href = url;

            link.setAttribute("download", "leads.csv");

            document.body.appendChild(link);

            link.click();

            link.remove();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLeads();
        }, 500);

        return () => clearTimeout(timer);
    }, [search, status, source, sort, currentPage]);

    useEffect(() => {
      setCurrentPage(1);
    }, [search, status, source, sort]);

    const newLeads = leads.filter((lead) => lead.status === "New").length;
    const qualifiedLeads = leads.filter((lead) => lead.status === "Qualified").length;
    const websiteLeads = leads.filter((lead) => lead.source === "Website").length;

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <section className="overflow-hidden rounded-[2rem] border border-white/45 bg-[linear-gradient(135deg,rgba(15,118,110,0.97),rgba(14,116,144,0.95),rgba(22,78,99,0.95))] p-6 text-white shadow-[0_30px_80px_-45px_rgba(8,47,73,0.75)] sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                    Leads are easier to act on when the workspace feels clear.
                                </h1>
                                <p className="max-w-2xl text-sm leading-6 text-white/78 sm:text-base">
                                    Add new prospects, filter the queue, and export pipeline data
                                    from one focused dashboard instead of hunting through clutter.
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={exportCSV}
                            size="lg"
                            className="h-11 rounded-xl border border-white/15 bg-white/12 px-5 text-white shadow-none backdrop-blur-sm hover:bg-white/18"
                        >
                            <FileSpreadsheet />
                            Export CSV
                        </Button>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card className="border-white/50 bg-white/80 dark:border-white/10 dark:bg-slate-950/55">
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-sm text-muted-foreground">Visible leads</p>
                                <p className="mt-2 text-3xl font-semibold">{leads.length}</p>
                            </div>
                            <div className="rounded-2xl bg-primary/12 p-3 text-primary">
                                <LayoutDashboard className="size-5" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-white/50 bg-white/80 dark:border-white/10 dark:bg-slate-950/55">
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-sm text-muted-foreground">New this page</p>
                                <p className="mt-2 text-3xl font-semibold">{newLeads}</p>
                            </div>
                            <div className="rounded-2xl bg-amber-500/12 p-3 text-amber-600 dark:text-amber-300">
                                <Activity className="size-5" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-white/50 bg-white/80 dark:border-white/10 dark:bg-slate-950/55">
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-sm text-muted-foreground">Qualified</p>
                                <p className="mt-2 text-3xl font-semibold">{qualifiedLeads}</p>
                            </div>
                            <div className="rounded-2xl bg-emerald-500/12 p-3 text-emerald-600 dark:text-emerald-300">
                                <Target className="size-5" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-white/50 bg-white/80 dark:border-white/10 dark:bg-slate-950/55">
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-sm text-muted-foreground">Website source</p>
                                <p className="mt-2 text-3xl font-semibold">{websiteLeads}</p>
                            </div>
                            <div className="rounded-2xl bg-cyan-500/12 p-3 text-cyan-700 dark:text-cyan-300">
                                <UsersRound className="size-5" />
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {user?.role === "admin" && <LeadForm fetchLeads={fetchLeads} />}

                <LeadTable
                    leads={leads}
                    fetchLeads={fetchLeads}
                    search={search}
                    setSearch={setSearch}
                    status={status}
                    setStatus={setStatus}
                    source={source}
                    setSource={setSource}
                    sort={sort}
                    setSort={setSort}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default Dashboard;
