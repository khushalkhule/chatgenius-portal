
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

// Mock data for demonstration
const usageData = [
  { date: "Jan", apiCalls: 2500, chatbots: 15, users: 45 },
  { date: "Feb", apiCalls: 3200, chatbots: 22, users: 58 },
  { date: "Mar", apiCalls: 4100, chatbots: 28, users: 72 },
  { date: "Apr", apiCalls: 4800, chatbots: 35, users: 85 },
  { date: "May", apiCalls: 5500, chatbots: 42, users: 95 },
  { date: "Jun", apiCalls: 6700, chatbots: 48, users: 118 },
];

const modelUsageData = [
  { model: "GPT-4o", usage: 45 },
  { model: "GPT-4o-mini", usage: 33 },
  { model: "GPT-3.5", usage: 12 },
  { model: "Claude-3", usage: 10 },
];

export function UsageStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>API Usage (Last 6 Months)</CardTitle>
          <CardDescription>
            Track API calls and platform growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="apiCalls" stroke="#8884d8" activeDot={{ r: 8 }} name="API Calls" />
                <Line type="monotone" dataKey="chatbots" stroke="#82ca9d" name="Active Chatbots" />
                <Line type="monotone" dataKey="users" stroke="#ffc658" name="Users" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Model Usage Distribution</CardTitle>
          <CardDescription>
            Percentage of API calls by model
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="model" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="usage" fill="#8884d8" name="Usage %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>API Usage Metrics</CardTitle>
          <CardDescription>
            Current month statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Total API Calls</dt>
              <dd className="text-2xl font-bold">12,543</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Average per User</dt>
              <dd className="text-2xl font-bold">98</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Peak Day</dt>
              <dd className="text-2xl font-bold">June 15</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Peak Hour</dt>
              <dd className="text-2xl font-bold">2-3pm</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
