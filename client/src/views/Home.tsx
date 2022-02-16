import React from "react";
import { MarkdownBlock } from "../components/md-block/MarkdownBlock";
import { NavigationBar } from "../components/NavigationBar";

const Home: React.FC = () => {
  return (
    <React.Fragment>
      <NavigationBar />
      <div className="container mx-auto">
        <div className="flex justify-center pt-4">
          <MarkdownBlock />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
