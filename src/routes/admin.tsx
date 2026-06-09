import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, LogOut } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold">Sign in required</h1>
        <Link to="/login" className="text-primary underline">Go to login</Link>
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="text-muted-foreground max-w-md">
          Your account ({user.email}) does not have admin role. Ask another admin to grant access, or insert
          a row in <code>user_roles</code> with role = 'admin' for your user id: <br /><code className="text-xs">{user.id}</code>
        </p>
        <Button variant="outline" onClick={async () => { await supabase.auth.signOut(); nav({ to: "/login" }); }}>
          <LogOut size={16} className="me-2" /> Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="ltr">
      <header className="bg-primary text-white py-6 px-6 flex items-center justify-between shadow">
        <div>
          <h1 className="text-2xl font-bold">Noor Academy — Admin</h1>
          <p className="text-sm text-white/70">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded text-sm">View site</Link>
          <Button variant="secondary" onClick={async () => { await supabase.auth.signOut(); nav({ to: "/login" }); }}>
            <LogOut size={16} className="me-2" /> Sign out
          </Button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="courses">
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact">Contact Info</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          <TabsContent value="courses"><CoursesAdmin /></TabsContent>
          <TabsContent value="faq"><FaqAdmin /></TabsContent>
          <TabsContent value="contact"><ContactAdmin /></TabsContent>
          <TabsContent value="messages"><MessagesAdmin /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// ----------- Courses -----------
type CourseRow = {
  id: string; title: string; description: string; price: string; duration: string;
  icon: string; category: string; is_featured: boolean; sort_order: number;
};
const emptyCourse: CourseRow = { id: "", title: "", description: "", price: "", duration: "", icon: "BookOpen", category: "adults", is_featured: false, sort_order: 0 };

function CoursesAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").order("sort_order");
      if (error) throw error;
      return data as CourseRow[];
    },
  });
  const [draft, setDraft] = useState<CourseRow>(emptyCourse);

  const save = useMutation({
    mutationFn: async (c: CourseRow) => {
      const { error } = await supabase.from("courses").upsert(c);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-courses"] }); qc.invalidateQueries({ queryKey: ["courses"] }); toast.success("Saved"); },
    onError: (e: any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-courses"] }); qc.invalidateQueries({ queryKey: ["courses"] }); toast.success("Deleted"); },
  });

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      <Card>
        <CardHeader><CardTitle>Add / edit course</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>ID (slug)</Label><Input value={draft.id} onChange={(e) => setDraft({ ...draft, id: e.target.value })} placeholder="bac" /></div>
          <div><Label>Title</Label><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
          <div><Label>Description</Label><Textarea rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Price</Label><Input value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} placeholder="5000 دج / شهرياً" /></div>
            <div><Label>Duration</Label><Input value={draft.duration} onChange={(e) => setDraft({ ...draft, duration: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><Label>Icon</Label><Input value={draft.icon} onChange={(e) => setDraft({ ...draft, icon: e.target.value })} placeholder="BookOpen" /></div>
            <div><Label>Category</Label>
              <select className="h-10 w-full border rounded px-2" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
                <option value="adults">Adults</option><option value="kids">Kids</option>
              </select>
            </div>
            <div><Label>Sort</Label><Input type="number" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} /></div>
          </div>
          <div className="flex items-center gap-2"><Switch checked={draft.is_featured} onCheckedChange={(v) => setDraft({ ...draft, is_featured: v })} /><Label>Featured</Label></div>
          <Button disabled={!draft.id || !draft.title || save.isPending} onClick={() => save.mutate(draft)} className="w-full">
            <Plus size={16} className="me-2" /> Save course
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Courses ({data?.length ?? 0})</CardTitle></CardHeader>
        <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
          {data?.map((c) => (
            <div key={c.id} className="flex items-center justify-between border rounded p-3">
              <div>
                <div className="font-bold">{c.title} {c.is_featured && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded ms-2">★</span>}</div>
                <div className="text-xs text-muted-foreground">{c.id} · {c.category} · {c.price}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setDraft(c)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => del.mutate(c.id)}><Trash2 size={14} /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ----------- FAQ -----------
function FaqAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-faq"],
    queryFn: async () => {
      const { data, error } = await supabase.from("faq_items").select("*").order("sort_order");
      if (error) throw error; return data;
    },
  });
  const [q, setQ] = useState(""); const [a, setA] = useState(""); const [order, setOrder] = useState(0);
  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("faq_items").insert({ question: q, answer: a, sort_order: order });
      if (error) throw error;
    },
    onSuccess: () => { setQ(""); setA(""); setOrder(0); qc.invalidateQueries({ queryKey: ["admin-faq"] }); qc.invalidateQueries({ queryKey: ["faq"] }); toast.success("Added"); },
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("faq_items").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-faq"] }); qc.invalidateQueries({ queryKey: ["faq"] }); },
  });
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      <Card>
        <CardHeader><CardTitle>Add FAQ</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Question</Label><Input value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <div><Label>Answer</Label><Textarea rows={4} value={a} onChange={(e) => setA(e.target.value)} /></div>
          <div><Label>Sort order</Label><Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} /></div>
          <Button disabled={!q || !a || add.isPending} onClick={() => add.mutate()} className="w-full"><Plus size={16} className="me-2" />Add</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Items ({data?.length ?? 0})</CardTitle></CardHeader>
        <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
          {data?.map((f: any) => (
            <div key={f.id} className="flex items-start justify-between border rounded p-3 gap-3">
              <div className="flex-1"><div className="font-semibold text-sm">{f.question}</div><div className="text-xs text-muted-foreground mt-1">{f.answer}</div></div>
              <Button size="sm" variant="destructive" onClick={() => del.mutate(f.id)}><Trash2 size={14} /></Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ----------- Contact info -----------
function ContactAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-contact"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_info").select("*").eq("id", "main").maybeSingle();
      if (error) throw error; return data;
    },
  });
  const [phone, setPhone] = useState(""); const [email, setEmail] = useState(""); const [address, setAddress] = useState("");
  const loaded = data?.id;
  if (loaded && !phone && !email && !address) { setPhone(data!.phone); setEmail(data!.email); setAddress(data!.address); }
  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("contact_info").upsert({ id: "main", phone, email, address });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-contact"] }); qc.invalidateQueries({ queryKey: ["contact_info"] }); toast.success("Saved"); },
  });
  return (
    <Card className="mt-6 max-w-xl">
      <CardHeader><CardTitle>Contact information</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div><Label>Phone (one per line)</Label><Textarea rows={3} value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
        <div><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><Label>Address</Label><Textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} /></div>
        <Button disabled={save.isPending} onClick={() => save.mutate()} className="w-full">Save</Button>
      </CardContent>
    </Card>
  );
}

// ----------- Messages -----------
function MessagesAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error; return data;
    },
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("contact_messages").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-messages"] }),
  });
  return (
    <Card className="mt-6">
      <CardHeader><CardTitle>Contact form messages ({data?.length ?? 0})</CardTitle></CardHeader>
      <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
        {data?.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
        {data?.map((m: any) => (
          <div key={m.id} className="border rounded p-4 flex justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-bold">{m.name}</span>
                <span className="text-xs text-muted-foreground" dir="ltr">{m.phone}</span>
                <span className="text-xs text-muted-foreground ms-auto">{new Date(m.created_at).toLocaleString()}</span>
              </div>
              <p className="text-sm whitespace-pre-line">{m.message}</p>
            </div>
            <Button size="sm" variant="destructive" onClick={() => del.mutate(m.id)}><Trash2 size={14} /></Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
