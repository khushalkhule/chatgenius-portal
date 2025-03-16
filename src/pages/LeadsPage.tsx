
import { useState } from "react";
import { Helmet } from "react-helmet";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Download, Search } from "lucide-react";
import { useChatbots } from "@/contexts/ChatbotContext";

// Mock lead data - in a real app, this would come from an API or context
const mockLeads = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    message: "I need help with integrating the chatbot",
    chatbotId: "1",
    timestamp: new Date(2023, 5, 10).toISOString(),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    message: "How do I customize the chatbot appearance?",
    chatbotId: "2",
    timestamp: new Date(2023, 5, 12).toISOString(),
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    message: "I'm interested in your pricing plans",
    chatbotId: "1",
    timestamp: new Date(2023, 5, 15).toISOString(),
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    message: "Can I integrate this with my Shopify store?",
    chatbotId: "3",
    timestamp: new Date(2023, 5, 18).toISOString(),
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@example.com",
    message: "Looking for AI chatbot solutions",
    chatbotId: "2",
    timestamp: new Date(2023, 5, 20).toISOString(),
  },
];

const LeadsPage = () => {
  const { chatbots } = useChatbots();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChatbot, setSelectedChatbot] = useState<string | null>(null);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Filter leads based on search term and selected chatbot
  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = 
      searchTerm === "" || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.message.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesChatbot = 
      selectedChatbot === null || lead.chatbotId === selectedChatbot;
      
    return matchesSearch && matchesChatbot;
  });
  
  // Get chatbot name by ID
  const getChatbotName = (id: string) => {
    const chatbot = chatbots.find(bot => bot.id === id);
    return chatbot ? chatbot.name : "Unknown Chatbot";
  };
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Leads | AI Chatbot Platform</title>
      </Helmet>
      
      <AnimatedTransition animation="fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-muted-foreground">
            Manage and export leads collected through your chatbots.
          </p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Lead Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select
                value={selectedChatbot || "all"}
                onValueChange={(value) => setSelectedChatbot(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="All Chatbots" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chatbots</SelectItem>
                  {chatbots.map((chatbot) => (
                    <SelectItem key={chatbot.id} value={chatbot.id}>
                      {chatbot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="md:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Chatbot</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{lead.message}</TableCell>
                        <TableCell>{getChatbotName(lead.chatbotId)}</TableCell>
                        <TableCell>{formatDate(lead.timestamp)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Send Email</DropdownMenuItem>
                              <DropdownMenuItem>Export</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No leads found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </AnimatedTransition>
    </DashboardLayout>
  );
};

export default LeadsPage;
