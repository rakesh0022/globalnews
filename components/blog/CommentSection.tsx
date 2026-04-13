"use client";

import { useState } from "react";
import Image from "next/image";
import { Comment } from "@/types";
import { formatDate } from "@/lib/utils";

// ── Single comment ────────────────────────────────────────────────────────────
function CommentItem({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const [liked,    setLiked]    = useState(false);
  const [likes,    setLikes]    = useState(comment.likes);
  const [replying, setReplying] = useState(false);

  function handleLike() {
    setLiked((v) => !v);
    setLikes((n) => liked ? n - 1 : n + 1);
  }

  return (
    <div className={depth > 0 ? "ml-10 mt-4" : ""}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 ring-2 ring-slate-100 dark:ring-slate-800">
          <Image src={comment.avatar} alt={comment.author} fill sizes="36px" className="object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">{comment.author}</span>
            <span className="text-[11px] text-slate-400">{formatDate(comment.publishedAt)}</span>
          </div>

          {/* Body */}
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{comment.body}</p>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-2">
            <button onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                liked ? "text-blue-600 dark:text-blue-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}>
              <svg className="w-3.5 h-3.5" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {likes}
            </button>
            {depth === 0 && (
              <button onClick={() => setReplying((v) => !v)}
                className="text-xs font-medium text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Reply
              </button>
            )}
          </div>

          {/* Reply box */}
          {replying && (
            <div className="mt-3">
              <ReplyBox onCancel={() => setReplying(false)} />
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {comment.replies?.map((r) => (
        <CommentItem key={r.id} comment={r} depth={depth + 1} />
      ))}
    </div>
  );
}

// ── Reply / new comment box ───────────────────────────────────────────────────
function ReplyBox({ onCancel, placeholder = "Write a reply…" }: { onCancel?: () => void; placeholder?: string }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim()) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 rounded-xl">
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Comment submitted for review. Thanks!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100
          bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700
          placeholder-slate-400 outline-none resize-none
          focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
      />
      <div className="flex items-center gap-2 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
            Cancel
          </button>
        )}
        <button type="submit" disabled={!text.trim()}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white
            hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          Post comment
        </button>
      </div>
    </form>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
interface Props { comments: Comment[] }

export default function CommentSection({ comments }: Props) {
  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-500 to-violet-600" />
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
          Discussion
          <span className="ml-2 text-sm font-normal text-slate-400">({comments.length} comments)</span>
        </h2>
      </div>

      {/* New comment */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-slate-800/60 shadow-sm">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Join the conversation</p>
        <ReplyBox placeholder="Share your thoughts…" />
      </div>

      {/* Comments list */}
      {comments.length > 0 ? (
        <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-800/60">
          {comments.map((c) => (
            <div key={c.id} className="pt-6 first:pt-0">
              <CommentItem comment={c} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400">
          <p className="text-sm">No comments yet. Be the first to share your thoughts.</p>
        </div>
      )}
    </section>
  );
}
