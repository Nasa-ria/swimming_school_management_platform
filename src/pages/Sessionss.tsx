import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Calendar, Clock, MapPin, Users, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Sessions() {
  const [skillLevel, setSkillLevel] = useState<"beginner" | "intermediate" | "advanced" | undefined>();
  
  const { data: sessions, isLoading } = trpc.sessions.list.useQuery({
    skillLevel,
    status: "scheduled",
    limit: 20,
    offset: 0,
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Swimming Sessions</h1>
          <p className="text-muted-foreground">Browse and book available swimming sessions</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <Select value={skillLevel || "all"} onValueChange={(value) => setSkillLevel(value === "all" ? undefined : value as any)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by skill level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sessions Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : sessions && sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{session.title}</CardTitle>
                    <Badge variant={session.skillLevel === "beginner" ? "default" : session.skillLevel === "intermediate" ? "secondary" : "destructive"}>
                      {session.skillLevel}
                    </Badge>
                  </div>
                  <CardDescription>{session.instructorName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{session.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(session.sessionDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{session.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{session.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{session.currentParticipants} / {session.maxParticipants} participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">${session.price}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/sessions/${session.id}`} className="w-full">
                    <Button className="w-full" disabled={session.currentParticipants >= session.maxParticipants}>
                      {session.currentParticipants >= session.maxParticipants ? "Session Full" : "View Details & Book"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No sessions available at the moment.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

