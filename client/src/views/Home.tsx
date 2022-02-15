import React from "react";
import { MarkdownBlock } from "../components/md-block/MarkdownBlock";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="flex justify-center">
        <MarkdownBlock />
      </div>
    </div>
  );
};

export default Home;
