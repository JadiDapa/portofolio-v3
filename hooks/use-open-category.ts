import { useRouter } from "next/navigation";

/** Returns a handler that opens /work filtered to a project category. */
export function useOpenCategory() {
  const router = useRouter();
  return (category: string) =>
    router.push(`/work?category=${encodeURIComponent(category)}`);
}
