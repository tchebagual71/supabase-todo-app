import MainLayout from "@/components/layout/MainLayout";
import * as Yup from "yup";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "flowbite-react";

interface RampItem {
  id: number;
  ramp_type: string;
  materials?: string;
  width: string;
  height: string;
  length?: string;
  construction_details?: string;
  image_url?: string;
}

interface FormValues {
  rampType: string;
  materials?: string;
  width: string;
  height: string;
  length?: string;
  constructionDetails?: string;
}

const RampBuild = () => {
  const supabaseClient = useSupabaseClient();
  const [ramps, setRamps] = useState<RampItem[]>([]);
  const [reloadRamps, setReloadRamps] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const initialValues: FormValues = {
    rampType: "",
    materials: "",
    width: "",
    height: "",
    length: "",
    constructionDetails: ""
  };

  const validationSchema = Yup.object({
    rampType: Yup.string().required("Required field."),
    materials: Yup.string(),
    width: Yup.string().required("Required field."),
    height: Yup.string().required("Required field."),
    length: Yup.string(),
    constructionDetails: Yup.string()
  });

  const onSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    let imageUrl = "";
    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop();
      const fileName = `ramps/${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const { error: uploadError, data: uploadData } = await supabaseClient.storage.from("ramps-images").upload(fileName, selectedFile);

      if (uploadError) {
        toast.error(`Upload failed: ${uploadError.message}`);
        return;
      }

      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ramps-images/${uploadData.path}`;
      setPreviewUrl(null);
    }

    const { error } = await supabaseClient.from("ramps").insert({
      ramp_type: values.rampType,
      materials: values.materials,
      width: values.width,
      height: values.height,
      length: values.length,
      construction_details: values.constructionDetails,
      image_url: imageUrl
    });

    if (error) {
      toast.error(`Error: ${error.message}`);
    } else {
      toast.success("Ramp added successfully");
      setReloadRamps(!reloadRamps);
      resetForm();
    }
  };

  useEffect(() => {
    const fetchRamps = async () => {
      const { data, error } = await supabaseClient.from("ramps").select("*").order("created_at", { ascending: false });
      if (error) {
        toast.error(error.message);
      } else {
        setRamps(data as RampItem[]);
      }
    };
    fetchRamps();
  }, [reloadRamps, supabaseClient]);

  return (
    <MainLayout className="bg-gray-50">
      <div className="flex flex-col items-center justify-center p-5 lg:p-16">
        <h1 className="text-3xl font-bold text-center text-gray-800 md:text-4xl lg:text-5xl mt-5 lg:mt-20">Build Your Ramp</h1>
        <p className="mt-3 text-lg text-gray-600 text-center">Fill in the details for your ramp below.</p>
        <div className="mt-8 w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
                <Form className="space-y-4">
                <div>
                  <label htmlFor="rampType" className="block text-sm font-medium text-gray-700">Type of Ramp</label>
                  <Field id="rampType" name="rampType" type="text" required className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div>
                  <label htmlFor="materials" className="block text-sm font-medium text-gray-700">Materials Used</label>
                  <Field as="textarea" id="materials" name="materials" className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="width" className="block text-sm font-medium text-gray-700">Width</label>
                    <Field id="width" name="width" type="text" required className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height</label>
                    <Field id="height" name="height" type="text" required className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label htmlFor="length" className="block text-sm font-medium text-gray-700">Length</label>
                    <Field id="length" name="length" type="text" className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                  </div>
                </div>
                <div>
                  <label htmlFor="constructionDetails" className="block text-sm font-medium text-gray-700">Construction Details</label>
                  <Field as="textarea" id="constructionDetails" name="constructionDetails" className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                  <input id="file" name="file" type="file" accept="image/*" onChange={(event) => {
                    setFieldValue("file", event.currentTarget.files[0]);
                    handleFileChange(event);
                  }} className="mt-1 p-2 block w-full file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-md file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100" />
                  {previewUrl && (
                    <img src={previewUrl} alt="Preview" className="mt-2 w-full max-w-xs rounded-md" />
                  )}
                </div>
                <div className="pt-5">
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Submit
                    </Button>
                  </div>
                </div>
              </Form>
            )}
        </Formik>
        <div className="mt-10">
          {ramps.map((ramp) => (
            <div key={ramp.id} className="p-4 my-2 bg-gray-100 rounded-md">
              <h3 className="text-lg font-bold">{ramp.ramp_type}</h3>
              <p>Materials: {ramp.materials}</p>
              <p>Dimensions: {`Width: ${ramp.width}, Height: ${ramp.height}, Length: ${ramp.length ? ramp.length : 'N/A'}`}</p>
              {ramp.construction_details && (
                <p>Construction Details: {ramp.construction_details}</p>
              )}
              {ramp.image_url && (
                <img src={ramp.image_url} alt="Ramp" className="mt-2 w-full max-w-xs rounded-md shadow-sm" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </MainLayout>
);
};

export default RampBuild;
