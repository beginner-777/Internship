"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type Comment = {
  id: number;
  author: string;
  text: string;
};

type Post = {
  id: number;
  author: string;
  username: string;
  initials: string;
  time: string;
  category: string;
  content: string;
  image?: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
};

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: "Ethan Miles",
    username: "@ethanbuilds",
    initials: "EM",
    time: "18 minutes ago",
    category: "Build Log",
    content:
      "Finished the first dyno session after installing the upgraded turbo and intercooler. Power delivery is much smoother than expected. Next step is suspension tuning before the first track day.",
    likes: 128,
    liked: false,
    comments: [
      {
        id: 1,
        author: "Jordan",
        text: "Great result. What boost pressure are you running?",
      },
    ],
  },
  {
    id: 2,
    author: "Maya Chen",
    username: "@mayadrives",
    initials: "MC",
    time: "2 hours ago",
    category: "Discussion",
    content:
      "What is the best daily-drivable suspension setup for an M4 Competition? I want improved handling without making city driving uncomfortable.",
    likes: 74,
    liked: false,
    comments: [
      {
        id: 1,
        author: "Alex",
        text: "Adjustable coilovers with conservative spring rates work well.",
      },
      {
        id: 2,
        author: "Marcus",
        text: "Consider upgrading the alignment before replacing everything.",
      },
    ],
  },
  {
    id: 3,
    author: "Noah Williams",
    username: "@noahgtr",
    initials: "NW",
    time: "Yesterday",
    category: "Track Day",
    content:
      "The GT-R completed its first full track session without heat-soak issues. The revised cooling setup made a major difference across longer runs.",
    likes: 213,
    liked: false,
    comments: [],
  },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [postText, setPostText] = useState("");
  const [postCategory, setPostCategory] = useState("Discussion");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");

  const imageUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }
    };
  }, []);

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    imageUrlRef.current = objectUrl;
    setImagePreview(objectUrl);
  };

  const createPost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const content = postText.trim();
    if (!content) return;

    const newPost: Post = {
      id: Date.now(),
      author: "You",
      username: "@yourgarage",
      initials: "YG",
      time: "Just now",
      category: postCategory,
      content,
      image: imagePreview ?? undefined,
      likes: 0,
      liked: false,
      comments: [],
    };

    setPosts((currentPosts) => [newPost, ...currentPosts]);
    setPostText("");
    setPostCategory("Discussion");
    setImagePreview(null);
    imageUrlRef.current = null;
  };

  const toggleLike = (postId: number) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );
  };

  const addComment = (
    event: FormEvent<HTMLFormElement>,
    postId: number,
  ) => {
    event.preventDefault();

    const text = commentText.trim();
    if (!text) return;

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: Date.now(),
                  author: "You",
                  text,
                },
              ],
            }
          : post,
      ),
    );

    setCommentText("");
  };

  return (
    <main className="relative min-h-[calc(100vh-88px)] overflow-hidden bg-black px-6 py-16 text-white lg:px-8">
      <div
        aria-hidden="true"
        className="absolute left-[-12rem] top-0 h-[34rem] w-[34rem] rounded-full bg-cyan-500/[0.05] blur-[150px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
            Automotive Community
          </p>

          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] sm:text-7xl">
            Built by drivers.
            <span className="block text-zinc-600">Shared with everyone.</span>
          </h1>

          <p className="mt-6 max-w-2xl leading-7 text-zinc-500">
            Share builds, ask technical questions and connect with automotive
            enthusiasts.
          </p>
        </header>

        <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            {/* Post composer */}
            <form
              onSubmit={createPost}
              className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-5"
            >
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] text-sm font-medium text-cyan-300">
                  YG
                </div>

                <textarea
                  value={postText}
                  onChange={(event) => setPostText(event.target.value)}
                  rows={4}
                  placeholder="Share a build update, question or driving experience..."
                  aria-label="Post content"
                  className="min-w-0 flex-1 resize-none bg-transparent text-sm leading-6 outline-none placeholder:text-zinc-700"
                />
              </div>

              {imagePreview && (
                <div className="relative mt-4 overflow-hidden rounded-xl border border-white/[0.08]">
                  <img
                    src={imagePreview}
                    alt="Post upload preview"
                    className="max-h-80 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    aria-label="Remove image"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-zinc-300"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.07] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer rounded-lg border border-white/[0.08] bg-black px-4 py-2 text-xs text-zinc-400 transition hover:text-white">
                    Add photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      className="sr-only"
                    />
                  </label>

                  <select
                    value={postCategory}
                    onChange={(event) =>
                      setPostCategory(event.target.value)
                    }
                    aria-label="Post category"
                    className="h-9 rounded-lg border border-white/[0.08] bg-black px-3 text-xs text-zinc-400 outline-none"
                  >
                    <option>Discussion</option>
                    <option>Build Log</option>
                    <option>Track Day</option>
                    <option>Question</option>
                    <option>Marketplace</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!postText.trim()}
                  className="h-10 rounded-lg bg-white px-6 text-sm font-semibold text-black transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:bg-zinc-900 disabled:text-zinc-700"
                >
                  Publish
                </button>
              </div>
            </form>

            {/* Feed */}
            <section className="mt-6 space-y-5">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-5 sm:p-6"
                >
                  <header className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black text-sm text-cyan-300">
                      {post.initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2">
                        <h2 className="font-medium">{post.author}</h2>
                        <span className="text-sm text-zinc-600">
                          {post.username}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-zinc-700">
                        {post.time}
                      </p>
                    </div>

                    <span className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.04] px-3 py-1.5 text-xs text-cyan-300">
                      {post.category}
                    </span>
                  </header>

                  <p className="mt-5 leading-7 text-zinc-300">
                    {post.content}
                  </p>

                  {post.image && (
                    <img
                      src={post.image}
                      alt="Community post attachment"
                      className="mt-5 max-h-[32rem] w-full rounded-xl border border-white/[0.08] object-cover"
                    />
                  )}

                  <div className="mt-6 flex items-center gap-5 border-t border-white/[0.07] pt-4 text-sm">
                    <button
                      type="button"
                      onClick={() => toggleLike(post.id)}
                      className={`transition ${
                        post.liked
                          ? "text-cyan-300"
                          : "text-zinc-600 hover:text-white"
                      }`}
                    >
                      {post.liked ? "♥" : "♡"} {post.likes}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setOpenComments(
                          openComments === post.id ? null : post.id,
                        )
                      }
                      className="text-zinc-600 transition hover:text-white"
                    >
                      Comments {post.comments.length}
                    </button>
                  </div>

                  {openComments === post.id && (
                    <div className="mt-5 border-t border-white/[0.07] pt-5">
                      <div className="space-y-4">
                        {post.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="rounded-xl bg-black/60 p-4"
                          >
                            <p className="text-xs font-medium text-cyan-300">
                              {comment.author}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-zinc-400">
                              {comment.text}
                            </p>
                          </div>
                        ))}

                        {post.comments.length === 0 && (
                          <p className="text-sm text-zinc-700">
                            No comments yet. Start the discussion.
                          </p>
                        )}
                      </div>

                      <form
                        onSubmit={(event) =>
                          addComment(event, post.id)
                        }
                        className="mt-4 flex gap-2"
                      >
                        <input
                          value={commentText}
                          onChange={(event) =>
                            setCommentText(event.target.value)
                          }
                          placeholder="Write a comment..."
                          aria-label="Write a comment"
                          className="h-11 min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-black px-4 text-sm outline-none placeholder:text-zinc-700 focus:border-cyan-300/30"
                        />

                        <button
                          type="submit"
                          disabled={!commentText.trim()}
                          className="h-11 rounded-xl bg-white px-5 text-sm font-medium text-black disabled:opacity-40"
                        >
                          Reply
                        </button>
                      </form>
                    </div>
                  )}
                </article>
              ))}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-6">
            <section className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-600">
                Community
              </p>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <CommunityStat value="48.2K" label="Members" />
                <CommunityStat value="1.8K" label="Online" />
                <CommunityStat value="12.4K" label="Builds" />
                <CommunityStat value="86K" label="Posts" />
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-600">
                Trending topics
              </p>

              <div className="mt-5 space-y-4">
                {[
                  "#TrackSetup",
                  "#SupraBuild",
                  "#TurboTuning",
                  "#GTROwners",
                  "#WeekendDrive",
                ].map((topic, index) => (
                  <button
                    key={topic}
                    type="button"
                    className="flex w-full items-center justify-between text-left"
                  >
                    <span className="text-sm text-zinc-300">{topic}</span>
                    <span className="text-xs text-zinc-700">
                      {1250 - index * 173} posts
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function CommunityStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-black p-4">
      <p className="text-lg font-medium">{value}</p>
      <p className="mt-1 text-xs text-zinc-600">{label}</p>
    </div>
  );
}