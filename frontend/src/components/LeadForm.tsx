import { useState } from "react";

import API from "../api/axios";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface Props {
  fetchLeads: () => void;
}

const LeadForm = ({ fetchLeads }: Props) => {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "New",
    source: "Website",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");
      await API.post("/leads", formData);

      setFormData({
        name: "",
        email: "",
        status: "New",
        source: "Website",
      });

      fetchLeads();
    } catch (err) {
      setError("Unable to create lead. Please log in again and retry.");
    }
  };

  return (
    <Card className="border-white/50 bg-white/80 shadow-none dark:border-white/10 dark:bg-slate-950/55">
      <CardHeader className="p-6 pb-0">
        <CardTitle>Add a new lead</CardTitle>
        <CardDescription>
          Capture contact details and drop the prospect directly into the pipeline.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-5">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-x-5 gap-y-6 md:grid-cols-2"
        >
          <div className="space-y-2.5">
            <label className="text-sm font-medium text-foreground/90">
              Lead name
            </label>
            <Input
              placeholder="Avery Johnson"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="h-11 rounded-xl bg-background/70 px-4"
            />
          </div>

          <div className="space-y-2.5">
            <label className="text-sm font-medium text-foreground/90">
              Email
            </label>
            <Input
              type="email"
              placeholder="avery@company.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="h-11 rounded-xl bg-background/70 px-4"
            />
          </div>

          <div className="space-y-2.5">
            <label className="text-sm font-medium text-foreground/90">
              Status
            </label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger className="h-11 rounded-xl bg-background px-4">
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2.5">
            <label className="text-sm font-medium text-foreground/90">
              Source
            </label>
            <Select
              value={formData.source}
              onValueChange={(value) =>
                setFormData({ ...formData, source: value })
              }
            >
              <SelectTrigger className="h-11 rounded-xl bg-background px-4">
                <SelectValue placeholder="Source" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end justify-start md:col-span-2">
            <Button
              type="submit"
              size="lg"
              variant="outline"
              className="h-11 w-full rounded-xl text-sm font-semibold sm:w-auto sm:min-w-[180px]"
            >
              <Plus />
              Create Lead
            </Button>
          </div>
        </form>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
};

export default LeadForm;
