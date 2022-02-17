import React from "react";
import { MarkdownBlock } from "../components/md-block/MarkdownBlock";
import { RichTextBlock } from "../components/md-block/RichTextBlock";
import { NavigationBar } from "../components/NavigationBar";

const Home: React.FC = () => {
  return (
    <React.Fragment>
      <NavigationBar />
      <div className="container mx-auto">
        <div className="flex justify-center pt-4">
          <RichTextBlock />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
