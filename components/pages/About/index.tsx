import MainLayout from "@/components/layout/MainLayout";
import React from "react";
import Image from "next/image";

const About = () => (
    <MainLayout className="bg-gray-50">
      <div className="flex flex-col items-center justify-center">
      <div className="px-4 py-8 md:px-16 lg:px-32">
        <h1 className="text-center text-xl font-bold">About Us</h1>
        <p className="mb-6 p-5 text-center text-gray-600">
          Rate my Fridge was a funny idea me and my buddy had one day. We were talking about how we could rate the contents of our fridge and then we thought, why not? We could make a website where people could upload pictures of their fridge and have others rate it. It was a fun idea and we decided to make it a reality. We hope you enjoy it as much as we do.

          <br />

          <br />

          - The Rate My Fridge Team
        </p>
        <div className="flex justify-center">
          <Image
            src="https://kagqxukzunpizemvxjro.supabase.co/storage/v1/object/public/todos-images/z0pc0lfa3sh.png" 
            width={500}
            height={500}
            alt="About Us"
            className="h-auto max-w-full rounded-lg shadow-lg"
            style={{ maxWidth: '500px', display: 'flex'}}
          />
        </div>
        </div>
      </div>
    </MainLayout>
  );

export default About;