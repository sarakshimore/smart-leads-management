import API from "../api/axios";
import { useEffect, useState } from "react";

import type { Lead } from "../types/lead";
import type { AppUser } from "../types/user";

import { useAuth } from "../context/AuthContext";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent } from "@/components/ui/card";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Pencil, Trash2, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  leads: Lead[];
  fetchLeads: () => void;
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  source: string;
  setSource: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
}

const LeadTable = ({
  leads,
  fetchLeads,
  search,
  setSearch,
  status,
  setStatus,
  source,
  setSource,
  sort,
  setSort,
}: Props) => {
  const { user } = useAuth();
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [assigningLead, setAssigningLead] = useState<Lead | null>(null);
  const [salesUsers, setSalesUsers] = useState<AppUser[]>([]);
  const [selectedSalesUserId, setSelectedSalesUserId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    status: "New",
    source: "Website",
  });

  const handleDelete = async (id: string) => {
    await API.delete(`/leads/${id}`);

    fetchLeads();
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Qualified":
        return "default";
      case "Lost":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const openEditDialog = (lead: Lead) => {
    setUpdateError("");
    setEditingLead(lead);
    setEditForm({
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
    });
  };

  useEffect(() => {
    const fetchSalesUsers = async () => {
      if (user?.role !== "admin") return;

      try {
        const { data } = await API.get("/users?page=1&search=");
        setSalesUsers((data.data as AppUser[]).filter((salesUser) => salesUser.isActive));
      } catch (error) {
        setSalesUsers([]);
      }
    };

    fetchSalesUsers();
  }, [user?.role]);

  const openAssignDialog = (lead: Lead) => {
    setAssignError("");
    setAssigningLead(lead);
    setSelectedSalesUserId("");
  };

  const handleAssignLead = async () => {
    if (!assigningLead || !selectedSalesUserId) return;

    try {
      setAssigning(true);
      setAssignError("");
      await API.patch(`/leads/${assigningLead._id}/assign`, {
        salesUserId: selectedSalesUserId,
      });
      setAssigningLead(null);
      setSelectedSalesUserId("");
      fetchLeads();
    } catch (error) {
      setAssignError("Unable to assign lead. Please try again.");
    } finally {
      setAssigning(false);
    }
  };

  const handleUpdateLead = async () => {
    if (!editingLead) return;

    try {
      setUpdating(true);
      setUpdateError("");
      await API.put(`/leads/${editingLead._id}`, editForm);
      setEditingLead(null);
      fetchLeads();
    } catch (error) {
      setUpdateError("Unable to update lead. Check permissions and try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card className="border-white/50 bg-white/80 shadow-none dark:border-white/10 dark:bg-slate-950/55">
      <CardHeader className="p-6 pb-0">
        <CardTitle>Lead pipeline</CardTitle>
        <CardDescription>
          Review each record, track qualification progress, and remove outdated entries when needed.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-hidden p-6 pt-4">
        <div className="mb-5 grid grid-cols-1 gap-4 rounded-2xl border border-border/60 bg-background/45 p-4 md:grid-cols-2 xl:grid-cols-4">
          <Input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 rounded-xl bg-background/80 px-4 xl:col-span-2"
          />

          <Select
            value={status || "all"}
            onValueChange={(value) => setStatus(value === "all" ? "" : value)}
          >
            <SelectTrigger className="h-11 rounded-xl bg-background px-4">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Qualified">Qualified</SelectItem>
              <SelectItem value="Lost">Lost</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={source || "all"}
            onValueChange={(value) => setSource(value === "all" ? "" : value)}
          >
            <SelectTrigger className="h-11 rounded-xl bg-background px-4">
              <SelectValue placeholder="All sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="Website">Website</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="Referral">Referral</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-11 rounded-xl bg-background px-4 md:col-span-2 xl:col-span-1">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {leads.length === 0 ? (
          <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-border bg-background/45 p-8 text-center">
            <div className="max-w-sm">
              <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Mail className="size-6" />
              </div>
              <h3 className="text-lg font-semibold">No leads match this view</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Try broadening the filters or add a fresh lead to start filling the pipeline.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-background/55">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/35">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead._id} className="hover:bg-muted/25">
                    <TableCell className="font-medium">
                      {lead.name}
                    </TableCell>

                    <TableCell className="text-muted-foreground">{lead.email}</TableCell>

                    <TableCell>
                      <Badge variant={getBadgeVariant(lead.status)}>
                        {lead.status}
                      </Badge>
                    </TableCell>

                    <TableCell>{lead.source}</TableCell>

                    <TableCell>
                      {user?.role === "admin" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2 rounded-lg"
                            onClick={() => openAssignDialog(lead)}
                          >
                            <UserCheck />
                            Assign
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2 rounded-lg"
                            onClick={() => openEditDialog(lead)}
                          >
                            <Pencil />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="cursor-pointer rounded-lg border-rose-200/70 bg-rose-50/85 px-3.5 text-rose-700 shadow-none hover:bg-rose-100/90 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/15"
                            onClick={() => handleDelete(lead._id)}
                          >
                            <Trash2 />
                            Delete
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <Dialog open={Boolean(assigningLead)} onOpenChange={(open) => !open && setAssigningLead(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign lead</DialogTitle>
            <DialogDescription>
              Assign this lead to one of your active sales users.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Select value={selectedSalesUserId} onValueChange={setSelectedSalesUserId}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select sales user" />
              </SelectTrigger>
              <SelectContent>
                {salesUsers.length === 0 ? (
                  <SelectItem value="no-users" disabled>
                    No active sales users
                  </SelectItem>
                ) : (
                  salesUsers.map((salesUser) => (
                    <SelectItem key={salesUser._id} value={salesUser._id}>
                      {salesUser.name} ({salesUser.email})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {assignError && <p className="text-sm text-destructive">{assignError}</p>}
          </div>
          <DialogFooter className="-mx-0 -mb-0 border-0 bg-transparent p-0 pt-2">
            <Button variant="outline" onClick={() => setAssigningLead(null)}>
              Cancel
            </Button>
            <Button onClick={handleAssignLead} disabled={assigning || !selectedSalesUserId || salesUsers.length === 0}>
              {assigning ? "Assigning..." : "Assign lead"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={Boolean(editingLead)} onOpenChange={(open) => !open && setEditingLead(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit lead</DialogTitle>
            <DialogDescription>
              Update lead details and save changes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Input
              value={editForm.name}
              onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Lead name"
              className="h-11"
            />
            <Input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
              className="h-11"
            />
            <Select
              value={editForm.status}
              onValueChange={(value) => setEditForm((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={editForm.source}
              onValueChange={(value) => setEditForm((prev) => ({ ...prev, source: value }))}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
              </SelectContent>
            </Select>
            {updateError && <p className="text-sm text-destructive">{updateError}</p>}
          </div>
          <DialogFooter className="-mx-0 -mb-0 border-0 bg-transparent p-0 pt-2">
            <Button variant="outline" onClick={() => setEditingLead(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateLead} disabled={updating}>
              {updating ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default LeadTable;
