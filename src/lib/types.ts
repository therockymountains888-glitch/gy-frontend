export type Tag = {
  slug: string;
  name: string;
};

export type PostListItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  published_at: string;
  tags: Tag[];
};

export type Post = PostListItem & {
  content: string;
};
