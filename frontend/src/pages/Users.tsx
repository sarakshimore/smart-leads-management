import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import type { AppUser } from "../types/user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface UserPayload {
  name: string;
  email: string;
  password: string;
}

interface EditPayload {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
}

const Users = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createForm, setCreateForm] = useState<UserPayload>({
    name: "",
    email: "",
    password: "",
  });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditPayload>({
    name: "",
    email: "",
    password: "",
    isActive: true,
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await API.get(`/users?page=${currentPage}&search=${search}`);
      setUsers(data.data);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    await API.post("/users", createForm);
    setCreateForm({ name: "", email: "", password: "" });
    fetchUsers();
  };

  const startEdit = (user: AppUser) => {
    setEditingUserId(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      password: "",
      isActive: user.isActive,
    });
  };

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;
    await API.put(`/users/${editingUserId}`, editForm);
    setEditingUserId(null);
    setEditForm({ name: "", email: "", password: "", isActive: true });
    fetchUsers();
  };

  const handleDeactivate = async (id: string) => {
    await API.delete(`/users/${id}`);
    fetchUsers();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <Card className="border-white/50 bg-white/80 shadow-none dark:border-white/10 dark:bg-slate-950/55">
          <CardHeader className="p-6 pb-2">
            <CardTitle>User Management</CardTitle>
            <CardDescription>Create and manage sales users.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6 pt-4">
            <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input
                placeholder="Name"
                value={createForm.name}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                className="h-11"
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={createForm.email}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
                className="h-11"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={createForm.password}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))}
                className="h-11"
                required
              />
              <div className="md:col-span-3">
                <Button type="submit" className="h-11 rounded-xl">
                  Create Sales User
                </Button>
              </div>
            </form>

            <Input
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 md:max-w-sm"
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="overflow-hidden rounded-2xl border border-border/70 bg-background/55">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5}>Loading users...</TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5}>No users found.</TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell className="space-x-2">
                          <Button variant="outline" size="sm" onClick={() => startEdit(user)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeactivate(user._id)}>
                            Deactivate
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </CardContent>
        </Card>

        {editingUserId && (
          <Card className="border-white/50 bg-white/80 shadow-none dark:border-white/10 dark:bg-slate-950/55">
            <CardHeader className="p-6 pb-2">
              <CardTitle>Edit Sales User</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <form onSubmit={handleEdit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  placeholder="Name"
                  value={editForm.name}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="h-11"
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="h-11"
                  required
                />
                <Input
                  type="password"
                  placeholder="Optional new password"
                  value={editForm.password}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="h-11"
                />
                <select
                  value={editForm.isActive ? "active" : "inactive"}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, isActive: e.target.value === "active" }))
                  }
                  className="h-11 rounded-xl border border-input bg-background px-3"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="md:col-span-2 flex gap-3">
                  <Button type="submit" className="h-11 rounded-xl">
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-xl"
                    onClick={() => setEditingUserId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Users;
