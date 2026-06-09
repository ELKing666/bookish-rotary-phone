import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Course = {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  image_url: string;
  icon: string;
  category: string;
  is_featured: boolean;
  sort_order: number;
  badge: string | null;
  stats: { value: string; label: string }[] | null;
  topics: { num: string; title: string; desc: string; tags: string[] }[] | null;
  for_whom: string[] | null;
};

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as unknown as Course[];
    },
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data as unknown as Course | null;
    },
  });
}

export function useFaq() {
  return useQuery({
    queryKey: ["faq"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faq_items").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useContactInfo() {
  return useQuery({
    queryKey: ["contact_info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_info").select("*").eq("id", "main").maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}
