import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Waves, Calendar, ShoppingBag, BookOpen, User } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Waves className="h-10 w-10 text-blue-600" />
            Swimming School Management
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your comprehensive platform for swimming lessons, booking sessions, shopping for equipment, and staying updated with the latest swimming tips and news.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/sessions">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Calendar className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Browse Sessions</CardTitle>
                <CardDescription>Find and book swimming lessons</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/my-bookings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Calendar className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>My Bookings</CardTitle>
                <CardDescription>View your scheduled sessions</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/shop">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <ShoppingBag className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Shop</CardTitle>
                <CardDescription>Browse swimming equipment</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/blog">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Blog</CardTitle>
                <CardDescription>Tips, news, and updates</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Session Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Book swimming sessions based on your skill level. Track your progress and manage your schedule with ease.
              </p>
              <Link href="/sessions">
                <Button className="mt-4 w-full">View Sessions</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>E-Commerce</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Shop for swimming wear, equipment, and accessories. Get everything you need for your swimming journey.
              </p>
              <Link href="/shop">
                <Button className="mt-4 w-full">Browse Shop</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Read articles, tips, and news about swimming. Stay informed and improve your skills.
              </p>
              <Link href="/blog">
                <Button className="mt-4 w-full">Read Blog</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <CardContent className="py-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Swimming Journey?</h2>
              <p className="text-lg mb-6 opacity-90">
                Join our swimming school today and experience professional training with state-of-the-art facilities.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/sessions">
                  <Button size="lg" variant="secondary">
                    Book a Session
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

