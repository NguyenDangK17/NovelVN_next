import React, { memo } from "react";

const Groups: React.FC = memo(() => (
  <div className="h-full">
    <h2 className="text-xl font-bold text-white mb-3">Groups</h2>
    <p className="text-white">
      Here you can find all the groups you are part of.
    </p>
  </div>
));

Groups.displayName = "Groups";

export default Groups;
