import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Carousel } from 'react-responsive-carousel';
import Image from "next/image";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

interface TodoItem {
  id: number;
  content: string;
  image_url?: string;
}

const HomePage = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabaseClient.from("todos").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        setTodos(data as TodoItem[]);
      } else {
        console.error("Error fetching todos:", error?.message);
      }
    };
    fetchTodos();
  }, [supabaseClient]);

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center px-4 py-8 md:px-16">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl md:text-4xl font-bold">Welcome to randos😊</h1>
          <p className="text-md md:text-xl text-gray-600">A place to enjoy and share your moments.</p>
        </div>
        {todos.length > 0 ? (
          <div className="mx-auto mt-10 w-full max-w-4xl">
            <Carousel
              showThumbs={false}
              showStatus={false}
              infiniteLoop
              autoPlay
              interval={5000}
              transitionTime={1000}
              useKeyboardArrows
              emulateTouch
              swipeable
              dynamicHeight={false} // Ensure consistent height
              stopOnHover
              className="carousel-custom"
            >
              {todos.map((todo) => (
                <div key={todo.id} className="relative h-96 w-full">
                  <Image
                    src={todo.image_url ?? "/default-placeholder.png"} // Fallback for missing images
                    alt="Shared moment"
                    layout="fill"
                    objectFit="cover" // Ensure cover without distorting aspect ratio
                    className="rounded-lg"
                  />
                  <div className="absolute bottom-0 w-full text-center">
                    <p className="truncate bg-black bg-opacity-70 p-4 text-white">{todo.content}</p>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        ) : (
          <p className="mt-10 text-gray-600">No moments to display yet. Be the first to share!</p>
        )}
      </div>
    </MainLayout>
  );
};

export default HomePage;