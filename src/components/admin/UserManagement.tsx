import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Search, MoreHorizontal, Plus, Lock, Mail, UserCheck, UserX } from "lucide-react";
import db from "@/services/database";

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    plan: "Basic",
  });
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsDataLoading(true);
      try {
        const results = await db.query(
          "SELECT * FROM users ORDER BY created_at DESC",
          []
        );
        
        const formattedUsers = results.map(user => ({
          id: user.id.toString(),
          name: user.name || user.username || "Unknown",
          email: user.email,
          plan: user.subscription_plan || "Basic",
          status: user.status || "active",
          lastActive: user.last_login_at || user.created_at,
          chatbots: user.chatbot_count || 0,
          avatarUrl: user.avatar_url || "",
        }));
        
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
        setUsers(mockUsers);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    setIsLoading(true);
    
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill all required fields");
      setIsLoading(false);
      return;
    }

    try {
      const result = await db.query(
        "INSERT INTO users (name, email, subscription_plan, status, created_at) VALUES (?, ?, ?, ?, ?)",
        [newUser.name, newUser.email, newUser.plan, "active", new Date().toISOString()]
      );
      
      const insertId = Array.isArray(result) && result.length > 0 && result[0].insertId 
        ? result[0].insertId 
        : Date.now().toString();
      
      const newUserObj = {
        id: insertId.toString(),
        name: newUser.name,
        email: newUser.email,
        plan: newUser.plan,
        status: "active",
        lastActive: new Date().toISOString(),
        chatbots: 0,
        avatarUrl: "",
      };

      setUsers([newUserObj, ...users]);
      setNewUser({ name: "", email: "", plan: "Basic" });
      setIsCreateUserOpen(false);
      toast.success("User created successfully");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = (userId, email) => {
    toast.success(`Password reset email sent to ${email}`);
  };

  const handleSendEmail = (userId, email) => {
    toast.success(`Email sent to ${email}`);
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    
    try {
      await db.query(
        "UPDATE users SET status = ? WHERE id = ?",
        [newStatus, userId]
      );
      
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );

      toast.success(
        `User ${newStatus === "active" ? "activated" : "suspended"} successfully`
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await db.query(
        "DELETE FROM users WHERE id = ?",
        [userId]
      );
      
      setUsers(users.filter((user) => user.id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlan = planFilter === "all" || user.plan === planFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage the users on your platform
          </CardDescription>
        </div>
        <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to your platform
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter user name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plan">Subscription Plan</Label>
                <Select
                  value={newUser.plan}
                  onValueChange={(value) =>
                    setNewUser({ ...newUser, plan: value })
                  }
                >
                  <SelectTrigger id="plan">
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Pro">Pro</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={planFilter}
            onValueChange={setPlanFilter}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Plans" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="Basic">Basic</SelectItem>
              <SelectItem value="Pro">Pro</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Chatbots</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isDataLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="h-4 w-4 bg-primary/60 rounded-full animate-bounce" />
                      <div className="h-4 w-4 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <div className="h-4 w-4 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center"
                  >
                    No users found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="cursor-pointer" onClick={() => handleViewUserDetails(user)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusBadgeColor(user.status)}
                      >
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.plan}</TableCell>
                    <TableCell>{user.chatbots}</TableCell>
                    <TableCell>{formatDate(user.lastActive)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResetPassword(user.id, user.email);
                            }}
                          >
                            <Lock className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendEmail(user.id, user.email);
                            }}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleUserStatus(user.id, user.status);
                            }}
                          >
                            {user.status === "active" ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Suspend User
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate User
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUser(user.id);
                            }}
                          >
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Comprehensive information about the user
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={selectedUser.avatarUrl} alt={selectedUser.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <Badge
                    variant="outline"
                    className={getStatusBadgeColor(selectedUser.status)}
                  >
                    {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Plan</h4>
                  <p>{selectedUser.plan}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Chatbots</h4>
                  <p>{selectedUser.chatbots}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Last Active</h4>
                  <p>{formatDate(selectedUser.lastActive)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Usage Statistics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground">API Calls</p>
                    <p className="text-lg font-bold">4,321</p>
                  </Card>
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground">Messages</p>
                    <p className="text-lg font-bold">1,234</p>
                  </Card>
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground">Storage</p>
                    <p className="text-lg font-bold">2.4 GB</p>
                  </Card>
                </div>
              </div>
              
              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => handleSendEmail(selectedUser.id, selectedUser.email)}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email User
                </Button>
                <div className="space-x-2">
                  <Button 
                    variant={selectedUser.status === "active" ? "destructive" : "success"}
                    onClick={() => {
                      handleToggleUserStatus(selectedUser.id, selectedUser.status);
                      setSelectedUser({
                        ...selectedUser, 
                        status: selectedUser.status === "active" ? "suspended" : "active"
                      });
                    }}
                  >
                    {selectedUser.status === "active" ? (
                      <>
                        <UserX className="mr-2 h-4 w-4" />
                        Suspend User
                      </>
                    ) : (
                      <>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Activate User
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    plan: "Pro",
    status: "active",
    lastActive: "2023-06-20T14:30:00.000Z",
    chatbots: 5,
    avatarUrl: "",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    plan: "Basic",
    status: "active",
    lastActive: "2023-06-19T10:15:00.000Z",
    chatbots: 2,
    avatarUrl: "",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    plan: "Enterprise",
    status: "inactive",
    lastActive: "2023-05-25T09:45:00.000Z",
    chatbots: 12,
    avatarUrl: "",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    plan: "Pro",
    status: "active",
    lastActive: "2023-06-18T16:20:00.000Z",
    chatbots: 4,
    avatarUrl: "",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    plan: "Basic",
    status: "suspended",
    lastActive: "2023-06-10T11:05:00.000Z",
    chatbots: 1,
    avatarUrl: "",
  },
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const getStatusBadgeColor = (status) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "inactive":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "suspended":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};
