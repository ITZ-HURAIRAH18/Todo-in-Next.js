"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string | null;
  email: string;
};

type ShareTodoModalProps = {
  todoId: string;
  todoTitle: string;
  onClose: () => void;
};

export default function ShareTodoModal({ todoId, todoTitle, onClose }: ShareTodoModalProps) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  useEffect(() => {
    // Fetch all users to share with
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleShare = async () => {
    if (!selectedUserId) {
      alert("Please select a user to share with");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/todo/${todoId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          canEdit,
        }),
      });

      const data = await response.json();
      console.log("Share response:", response.status, data);

      if (response.ok) {
        alert("Todo shared successfully!");
        router.refresh();
        onClose();
      } else {
        console.error("Share failed:", data);
        alert(data.error || `Failed to share todo: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error sharing todo:", error);
      alert(`Failed to share todo: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">🔗 Share Todo</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            Share <span className="font-semibold text-foreground">"{todoTitle}"</span> with:
          </p>
        </div>

        <div className="space-y-4">
          {isLoadingUsers ? (
            <p className="text-center text-muted-foreground py-4">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No other users available</p>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select User
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full bg-background border border-input rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-ring"
                >
                  <option value="">Choose a user...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.email} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="canEdit"
                  checked={canEdit}
                  onChange={(e) => setCanEdit(e.target.checked)}
                  className="w-4 h-4 rounded border-input"
                />
                <label htmlFor="canEdit" className="text-sm text-foreground">
                  Allow editing permissions
                </label>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleShare}
            disabled={isLoading || !selectedUserId}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? "Sharing..." : "Share"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
