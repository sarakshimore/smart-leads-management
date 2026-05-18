export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
  assignedTo?: string;
  createdAt: string;
}
