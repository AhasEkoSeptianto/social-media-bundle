export interface FeedTypes {
  _id: string;
  author: {
    _id: string;
    email: string;
    name: string;
    avatarUrl: string;
  };
  postContext: string;
  images: string;
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  sharesCount: number;
}

export interface PostsResponse {
  success: boolean;
  data: {
    data: {
      posts: FeedTypes[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
  };
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
