import { User } from "@/generated/prisma";

export default function UserCard({ user }: { user: User }) {
  return (
    <div className="db-card" data-tone={user.role === "ADMIN" ? "pink" : undefined}>
      <div className="db-card_panel">
        <div className="db-card_top">
          <div className="db-avatar">
            {(user.name || user.username).charAt(0)}
          </div>
          <span
            className="db-stamp"
            data-tone={user.role === "ADMIN" ? "alert" : "quiet"}
          >
            {user.role.toLowerCase()}
          </span>
        </div>

        <div className="db-card_foot">
          <p className="db-cell-title truncate">{user.name || "Unnamed"}</p>
          <p className="db-cell-sub">@{user.username}</p>
        </div>
      </div>
    </div>
  );
}
