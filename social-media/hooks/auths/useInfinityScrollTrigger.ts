import { useEffect, useRef } from "react";

interface UseInfiniteScrollTriggerOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean | undefined;
  // Jarak (px) sebelum elemen sentinel benar-benar terlihat -- supaya
  // loadMore dipanggil SEBELUM user benar-benar mentok di bawah,
  // jadi terasa mulus (data sudah siap sebelum user sampai ujung).
  rootMargin?: string;
}

/**
 * Return sebuah ref yang harus ditaruh di elemen "sentinel" (biasanya
 * div kosong/spinner) di paling bawah list. Begitu elemen ini masuk
 * viewport, onLoadMore() otomatis dipanggil.
 */
export function useInfiniteScrollTrigger({
  onLoadMore,
  hasMore,
  isLoading,
  rootMargin = "400px",
}: UseInfiniteScrollTriggerOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoading) {
          onLoadMore();
        }
      },
      { rootMargin },
    );

    observer.observe(node);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isLoading, onLoadMore, rootMargin]);

  return sentinelRef;
}
