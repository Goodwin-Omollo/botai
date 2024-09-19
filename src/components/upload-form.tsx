"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader, Upload } from "lucide-react";
import { toast } from "sonner";
import { useUploadThing } from "@/utils/uploadthing";

type Props = {};

const formSchema = z.object({
  title: z
    .string({
      required_error: "Document Title is required",
    })
    .min(2)
    .max(50),
  file: z.instanceof(File),
});

const UploadDocumentForm = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { startUpload, isUploading } = useUploadThing("documentUploader", {
    onClientUploadComplete: (res) => {
      console.log("Res", res);
      const url = res.map((res) => res.url)[0];

      toast.success("Document uploaded successfully");
      setIsOpen(false);
    },
    onUploadError: () => {
      toast.error("Failed to upload document");
    },
    onUploadBegin: (file) => {
      console.log("Upload has begun for", file);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { file } = values;
      if (!file) {
        throw new Error("No file selected");
      }

      startUpload([file]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload document");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center" size="sm">
          <Upload className="w-4 h-4 mx-2" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a document</DialogTitle>
          <DialogDescription>
            You will be able to search through this document later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g constitution" {...field} />
                  </FormControl>
                  <FormDescription>A title for your document.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept=".txt,.xml,.doc,.docx,.pdf"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end items-end">
              <Button
                disabled={form.formState.isSubmitting || isUploading}
                size="sm"
              >
                {form.formState.isSubmitting || isUploading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  "Add Document"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentForm;
