import { useState } from "react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { CheckCircle, XCircle } from "lucide-react";

const ContentModerator = () => {
  const [posts, setPosts] = useState([
    { id: 1, content: "This is a sample post.", flagged: false },
    { id: 2, content: "Another post to review.", flagged: true },
  ]);

  const handleDecision = (id, approved) => {
    setPosts(posts.filter(post => post.id !== id));
    alert(`Post ${id} has been ${approved ? "approved" : "removed"}.`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Content Moderation</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded-lg shadow-sm">
            <p className="mb-2">{post.content}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch checked={post.flagged} disabled />
                <span className="text-sm text-gray-600">
                  {post.flagged ? "Flagged" : "Not Flagged"}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => handleDecision(post.id, true)} variant="success">
                  <CheckCircle className="w-4 h-4 mr-1" /> Approve
                </Button>
                <Button onClick={() => handleDecision(post.id, false)} variant="destructive">
                  <XCircle className="w-4 h-4 mr-1" /> Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentModerator;
