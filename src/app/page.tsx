import React from "react";
import Chatbot from "./chatbot";
import UploadDocumentForm from "@/components/upload-form";

type Props = {};

const HomeInit = (props: Props) => {
  return (
    <div className="container min-h-screen py-8 px-4">
      <div className="flex justify-end items-center mb-2">
        <UploadDocumentForm />
      </div>
    </div>
  );
};

export default HomeInit;
