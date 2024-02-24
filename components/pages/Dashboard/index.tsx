/* eslint-disable @next/next/no-img-element */
/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable jsx-a11y/label-has-associated-control */
// eslint-disable-next-line jsx-a11y/label-has-associated-control


import MainLayout from "@/components/layout/MainLayout";
import * as Yup from "yup";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Button from "@/components/shared/Button";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface TodoItem {
  id: number; // Adjust according to your actual data model if necessary.
  content: string;
  image_url?: string;
}

interface FormValues {
  todoData: string;
}

const Dashboard = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [reloadTodos, setReloadTodos] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const validationSchema = Yup.object({
    todoData: Yup.string().required("Required field."),
  });

  const initialValues: FormValues = { todoData: "" };

  const onSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    let imageUrl = "";
    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop();
      const fileName = `todos/${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const { error: uploadError, data: uploadData } = await supabaseClient.storage.from("todos-images").upload(fileName, selectedFile);

      if (uploadError) {
        toast.error(`Upload failed: ${uploadError.message}`);
        return;
      }

      // Assuming uploadData contains a property 'path' that holds the file path
      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/todos-images/${uploadData.path}`;
    }

    const { error } = await supabaseClient.from("todos").insert({
      content: values.todoData,
      user_uuid: user?.id,
      image_url: imageUrl,
    });

    if (error) {
      toast.error(`Error: ${error.message}`);
    } else {
      toast.success("Todo added successfully");
      setReloadTodos(!reloadTodos);
      resetForm();
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabaseClient.from("todos").select("*").order("created_at", { ascending: false });
      if (error) {
        toast.error(error.message);
      } else {
        // Cast the fetched data to TodoItem[] to satisfy TypeScript's type checking
        setTodos(data as TodoItem[]);
      }
    };
    fetchTodos();
  }, [reloadTodos, supabaseClient]);

  return (
    <MainLayout className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-16">
        <h1 className="mt-20 text-display-lg font-bold">Create Rando😊</h1>
        <p className="text-xl text-gray-600">Just select an image and add a comment.</p>
        <div className="flex w-full max-w-screen-sm flex-col">
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ isSubmitting }) => (
              <Form className="mt-8 flex flex-col items-center gap-4">
                <Field as="textarea" name="todoData" className="textarea form-field" placeholder="An interesting title or comment..." />
                <input id="file" name="file" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <label htmlFor="file" className="btn btn-primary cursor-pointer">Choose Image</label>
                <Button type="submit" disabled={isSubmitting}>Submit</Button>
              </Form>
            )}
          </Formik>
          <div className="mt-4">
            {todos.map((todo) => (
              <div key={todo.id} className="todo-item flex flex-col">
                <p>{todo.content}</p>
                {todo.image_url && <img src={todo.image_url} alt="Todo" className="mt-2 w-full max-w-xs" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;