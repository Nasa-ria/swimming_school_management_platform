import { useRoute } from "wouter";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { trpc } from "../lib/trpc";
import { Calendar, Clock, MapPin, Users, DollarSign, ArrowLeft } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function SessionDetail() {
  const [, params] = useRoute("/sessions/:id");
  const [, setLocation] = useLocation();
  const [notes, setNotes] = useState("");
  
  const sessionId = params?.id ? parseInt(params.id) : 0;
  
  const { data: session, isLoading } = trpc.sessions.getById.useQuery({ id: sessionId });
  const bookMutation = trpc.bookings.create.useMutation({
    onSuccess: () => {
      toast.success("Session booked successfully!");
      setLocation("/my-bookings");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to book session");
    },
  });

  const handleBook = () => {
    bookMutation.mutate({ sessionId, notes });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Session not found</p>
              <Link href="/sessions">
                <Button className="mt-4">Back to Sessions</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const isFull = session.currentParticipants >= session.maxParticipants;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <Link href="/sessions">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sessions
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-3xl">{session.title}</CardTitle>
                  <Badge variant={session.skillLevel === "beginner" ? "default" : session.skillLevel === "intermediate" ? "secondary" : "destructive"}>
                    {session.skillLevel}
                  </Badge>
                </div>
                <CardDescription className="text-lg">Instructor: {session.instructorName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{session.description || "No description available."}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{new Date(session.sessionDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{session.duration} minutes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{session.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Participants</p>
                      <p className="font-medium">{session.currentParticipants} / {session.maxParticipants}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  ${session.price}
                </CardTitle>
                <CardDescription>Per session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="notes">Booking Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requirements or questions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-2"
                    rows={4}
                  />
                </div>

                {isFull && (
                  <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                    This session is currently full. Please check back later or choose another session.
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  disabled={isFull || bookMutation.isPending}
                  onClick={handleBook}
                >
                  {bookMutation.isPending ? "Booking..." : isFull ? "Session Full" : "Book Now"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

