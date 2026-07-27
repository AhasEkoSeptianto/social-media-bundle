import useSWRInfinite from "swr/infinite";
import { nextFetcher } from "@/lib/fetcher";
import { FeedTypes, PaginationResponse } from "@/type/components/features/feed";

const PAGE_SIZE = 10;

interface PostsPage {
  success: boolean;
  data: {
    posts: FeedTypes[];
    pagination: PaginationResponse;
  };
}

/**
 * Menentukan key/URL untuk tiap "halaman" data.
 * useSWRInfinite manggil fungsi ini per halaman -- return null berarti
 * "stop, tidak usah fetch lagi" (dipakai saat sudah sampai halaman terakhir).
 */
function getKey(pageIndex: number, previousPageData: PostsPage | null) {
  // Halaman pertama: previousPageData masih null, selalu fetch
  if (pageIndex === 0) return `/api/posts/get?page=1&limit=${PAGE_SIZE}`;

  // Kalau halaman sebelumnya sudah tidak ada post-nya (kosong),
  // atau sudah melewati totalPages -- berhenti fetch lebih lanjut.
  const prevPagination = previousPageData?.data?.pagination;
  if (prevPagination && pageIndex + 1 > prevPagination.totalPages) {
    return null;
  }

  return `/api/posts/get?page=${pageIndex + 1}&limit=${PAGE_SIZE}`;
}

export function usePosts() {
  const { data, error, isLoading, size, setSize, mutate } =
    useSWRInfinite<PostsPage>(getKey, nextFetcher, {
      shouldRetryOnError: false,
      revalidateFirstPage: false, // jangan refetch halaman 1 tiap kali loadMore dipanggil
    });

  // Gabungkan semua halaman jadi 1 array post datar
  const posts = data ? data.flatMap((page) => page?.data?.posts ?? []) : [];

  const lastPage = data?.[data.length - 1];
  const pagination = lastPage?.data?.pagination;

  const isLoadingInitial = !data && !error && isLoading;
  const isLoadingMore =
    isLoadingInitial ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isReachingEnd =
    pagination !== undefined && size >= pagination.totalPages;

  function loadMore() {
    if (isLoadingMore || isReachingEnd) return;
    setSize(size + 1);
  }

  return {
    posts,
    isLoading: isLoadingInitial,
    isLoadingMore,
    isReachingEnd,
    isError: error,
    loadMore,
    mutate, // tetap tersedia untuk refresh manual (dipakai like/delete di feed.tsx)
  };
}
