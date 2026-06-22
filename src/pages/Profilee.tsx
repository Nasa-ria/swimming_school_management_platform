Text file: Profile.tsx
Latest content with line numbers:
1	import { useState, useEffect } from "react";
2	import DashboardLayout from "@/components/DashboardLayout";
3	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
4	import { Button } from "@/components/ui/button";
5	import { Input } from "@/components/ui/input";
6	import { Label } from "@/components/ui/label";
7	import { Textarea } from "@/components/ui/textarea";
8	import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
9	import { Separator } from "@/components/ui/separator";
10	import { Badge } from "@/components/ui/badge";
11	import { trpc } from "@/lib/trpc";
12	import { useAuth } from "@/_core/hooks/useAuth";
13	import { toast } from "sonner";
14	import { User, Mail, Phone, Calendar, MapPin, AlertCircle, Save, Edit2 } from "lucide-react";
15	import { Skeleton } from "@/components/ui/skeleton";
16	
17	export default function Profile() {
18	  const { user: authUser } = useAuth();
19	  const [isEditing, setIsEditing] = useState(false);
20	  
21	  const { data: profile, isLoading, refetch } = trpc.profile.get.useQuery();
22	  const updateMutation = trpc.profile.update.useMutation({
23	    onSuccess: () => {
24	      toast.success("Profile updated successfully!");
25	      setIsEditing(false);
26	      refetch();
27	    },
28	    onError: (error) => {
29	      toast.error(error.message || "Failed to update profile");
30	    },
31	  });
32	
33	  // Form state
34	  const [formData, setFormData] = useState({
35	    name: "",
36	    phoneNumber: "",
37	    dateOfBirth: "",
38	    address: "",
39	    emergencyContact: "",
40	    skillLevel: "beginner" as "beginner" | "intermediate" | "advanced",
41	  });
42	
43	  // Initialize form data when profile loads
44	  useEffect(() => {
45	    if (profile) {
46	      setFormData({
47	        name: profile.name || "",
48	        phoneNumber: profile.phoneNumber || "",
49	        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : "",
50	        address: profile.address || "",
51	        emergencyContact: profile.emergencyContact || "",
52	        skillLevel: profile.skillLevel || "beginner",
53	      });
54	    }
55	  }, [profile]);
56	
57	  const handleInputChange = (field: string, value: string) => {
58	    setFormData(prev => ({ ...prev, [field]: value }));
59	  };
60	
61	  const handleSubmit = (e: React.FormEvent) => {
62	    e.preventDefault();
63	    updateMutation.mutate(formData);
64	  };
65	
66	  const handleCancel = () => {
67	    if (profile) {
68	      setFormData({
69	        name: profile.name || "",
70	        phoneNumber: profile.phoneNumber || "",
71	        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : "",
72	        address: profile.address || "",
73	        emergencyContact: profile.emergencyContact || "",
74	        skillLevel: profile.skillLevel || "beginner",
75	      });
76	    }
77	    setIsEditing(false);
78	  };
79	
80	  if (isLoading) {
81	    return (
82	      <DashboardLayout>
83	        <div className="container mx-auto px-4 py-8">
84	          <Card>
85	            <CardHeader>
86	              <Skeleton className="h-8 w-1/3 mb-2" />
87	              <Skeleton className="h-4 w-1/2" />
88	            </CardHeader>
89	            <CardContent>
90	              <div className="space-y-4">
91	                {[...Array(6)].map((_, i) => (
92	                  <div key={i}>
93	                    <Skeleton className="h-4 w-1/4 mb-2" />
94	                    <Skeleton className="h-10 w-full" />
95	                  </div>
96	                ))}
97	              </div>
98	            </CardContent>
99	          </Card>
100	        </div>
101	      </DashboardLayout>
102	    );
103	  }
104	
105	  if (!profile) {
106	    return (
107	      <DashboardLayout>
108	        <div className="container mx-auto px-4 py-8">
109	          <Card>
110	            <CardContent className="py-12 text-center">
111	              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
112	              <p className="text-lg font-medium mb-2">Profile not found</p>
113	              <p className="text-muted-foreground">Please try logging in again</p>
114	            </CardContent>
115	          </Card>
116	        </div>
117	      </DashboardLayout>
118	    );
119	  }
120	
121	  return (
122	    <DashboardLayout>
123	      <div className="container mx-auto px-4 py-8">
124	        <div className="mb-8 flex justify-between items-center">
125	          <div>
126	            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
127	            <p className="text-muted-foreground">Manage your personal information and swimming preferences</p>
128	          </div>
129	          {!isEditing && (
130	            <Button onClick={() => setIsEditing(true)} variant="outline">
131	              <Edit2 className="h-4 w-4 mr-2" />
132	              Edit Profile
133	            </Button>
134	          )}
135	        </div>
136	
137	        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
138	          {/* Profile Summary Card */}
139	          <Card className="lg:col-span-1">
140	            <CardHeader>
141	              <CardTitle>Profile Summary</CardTitle>
142	            </CardHeader>
143	            <CardContent className="space-y-4">
144	              <div className="flex flex-col items-center text-center">
145	                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
146	                  {profile.name?.charAt(0)?.toUpperCase() || "U"}
147	                </div>
148	                <h3 className="text-xl font-semibold">{profile.name || "User"}</h3>
149	                <p className="text-sm text-muted-foreground">{profile.email}</p>
150	                <Badge className="mt-3" variant={
151	                  profile.skillLevel === "beginner" ? "default" : 
152	                  profile.skillLevel === "intermediate" ? "secondary" : 
153	                  "destructive"
154	                }>
155	                  {profile.skillLevel || "Beginner"}
156	                </Badge>
157	              </div>
158	
159	              <Separator />
160	
161	              <div className="space-y-3 text-sm">
162	                <div className="flex items-center gap-2 text-muted-foreground">
163	                  <User className="h-4 w-4" />
164	                  <span>Role: {profile.role === "admin" ? "Administrator" : "Student"}</span>
165	                </div>
166	                <div className="flex items-center gap-2 text-muted-foreground">
167	                  <Calendar className="h-4 w-4" />
168	                  <span>Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
169	                </div>
170	                <div className="flex items-center gap-2 text-muted-foreground">
171	                  <Mail className="h-4 w-4" />
172	                  <span>Login: {profile.loginMethod || "Email"}</span>
173	                </div>
174	              </div>
175	            </CardContent>
176	          </Card>
177	
178	          {/* Profile Details Form */}
179	          <Card className="lg:col-span-2">
180	            <CardHeader>
181	              <CardTitle>Personal Information</CardTitle>
182	              <CardDescription>
183	                {isEditing ? "Update your profile information" : "Your profile details"}
184	              </CardDescription>
185	            </CardHeader>
186	            <CardContent>
187	              <form onSubmit={handleSubmit} className="space-y-6">
188	                {/* Basic Information */}
189	                <div className="space-y-4">
190	                  <h3 className="text-lg font-semibold">Basic Information</h3>
191	                  
192	                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
193	                    <div className="space-y-2">
194	                      <Label htmlFor="name">Full Name</Label>
195	                      <div className="relative">
196	                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
197	                        <Input
198	                          id="name"
199	                          value={formData.name}
200	                          onChange={(e) => handleInputChange("name", e.target.value)}
201	                          disabled={!isEditing}
202	                          className="pl-10"
203	                          placeholder="Enter your full name"
204	                        />
205	                      </div>
206	                    </div>
207	
208	                    <div className="space-y-2">
209	                      <Label htmlFor="email">Email Address</Label>
210	                      <div className="relative">
211	                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
212	                        <Input
213	                          id="email"
214	                          value={profile.email || ""}
215	                          disabled
216	                          className="pl-10 bg-muted"
217	                          placeholder="Email (cannot be changed)"
218	                        />
219	                      </div>
220	                    </div>
221	
222	                    <div className="space-y-2">
223	                      <Label htmlFor="phoneNumber">Phone Number</Label>
224	                      <div className="relative">
225	                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
226	                        <Input
227	                          id="phoneNumber"
228	                          type="tel"
229	                          value={formData.phoneNumber}
230	                          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
231	                          disabled={!isEditing}
232	                          className="pl-10"
233	                          placeholder="+1 (555) 000-0000"
234	                        />
235	                      </div>
236	                    </div>
237	
238	                    <div className="space-y-2">
239	                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
240	                      <div className="relative">
241	                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
242	                        <Input
243	                          id="dateOfBirth"
244	                          type="date"
245	                          value={formData.dateOfBirth}
246	                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
247	                          disabled={!isEditing}
248	                          className="pl-10"
249	                        />
250	                      </div>
251	                    </div>
252	                  </div>
253	
254	                  <div className="space-y-2">
255	                    <Label htmlFor="address">Address</Label>
256	                    <div className="relative">
257	                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
258	                      <Textarea
259	                        id="address"
260	                        value={formData.address}
261	                        onChange={(e) => handleInputChange("address", e.target.value)}
262	                        disabled={!isEditing}
263	                        className="pl-10 min-h-[80px]"
264	                        placeholder="Enter your full address"
265	                      />
266	                    </div>
267	                  </div>
268	                </div>
269	
270	                <Separator />
271	
272	                {/* Swimming Information */}
273	                <div className="space-y-4">
274	                  <h3 className="text-lg font-semibold">Swimming Information</h3>
275	                  
276	                  <div className="space-y-2">
277	                    <Label htmlFor="skillLevel">Skill Level</Label>
278	                    <Select
279	(Content truncated due to size limit. Use page ranges or line ranges to read remaining content)