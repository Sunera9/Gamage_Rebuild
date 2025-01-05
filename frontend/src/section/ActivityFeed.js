const ActivityFeed = () => {
    return (
        <div className="flex items-center justify-end">
          <div className="w-full max-w-6xl bg-white rounded p-6 mb-8">
          <h3 className="text-lg font-semibold">Activity Feed</h3>
          <ul className="mt-4 space-y-2">
            <li>
              User1 Apply for the job <strong>Project Manager</strong> - 10 min ago
            </li>
            <li>
              User2 Apply for the job <strong>Web Developer</strong> - 20 min ago
            </li>
            <li>
              User3 Apply for the job <strong>Assistant Manager</strong> - 30 min ago
            </li>
          </ul>
        </div>
      </div>
    );
  };
  
  export default ActivityFeed;
  