import MainLayout from "@/components/layout/MainLayout";
import * as Yup from "yup";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Button from "@/components/shared/Button";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface RampItem {
  id: number;
  ramp_type: string;
  materials?: string; // Marking as optional as per your DB schema
  width: string;   
  height: string; // Added based on your SQL definition
  length?: string;  // Marking as optional as per your DB schema
  construction_details?: string; // Marking as optional as per your DB schema
  image_url?: string;
}

interface FormValues {
  rampType: string;
  materials?: string; 
  width: string;   
  height: string;  // Added
  length?: string;  
  constructionDetails?: string; 
}

const RampBuildTest = () => {
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
    height: "",   // Added
    length: "",   
    constructionDetails: ""
  };

  const validationSchema = Yup.object({
    rampType: Yup.string().required("Required field."),
    materials: Yup.string(), // Optional in form, check your business logic
    width: Yup.string().required("Required field."),     
    height: Yup.string().required("Required field."),   // Added
    length: Yup.string(),    // Optional in form, check your business logic  
    constructionDetails: Yup.string() // Optional in form, check your business logic
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
      <div className="flex flex-col items-center justify-center px-16">
        <h1 className="mt-20 text-display-lg font-bold">Build Your Ramp</h1>
        <p className="text-xl text-gray-600">
          Fill in the details for your ramp below.
        </p>
        <div className="flex w-full max-w-screen-sm flex-col">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="mt-8 flex flex-col items-center gap-4">
                <Field
                  as="input"
                  name="rampType"
                  className="input form-field"
                  placeholder="Type of Ramp"
                />
                <Field
                  as="textarea"
                  name="materials"
                  className="textarea form-field"
                  placeholder="Materials Used"
                />
                <Field
                  as="input"
                  name="width"
                  className="input form-field"
                  placeholder="Width"
                />
                <Field
                  as="input"
                  name="height"
                  className="input form-field"
                  placeholder="Height"
                />
                <Field
                  as="input"
                  name="length"
                  className="input form-field"
                  placeholder="Length"
                />
                <Field
                  as="textarea"
                  name="constructionDetails"
                  className="textarea form-field"
                  placeholder="Construction Details"
                />
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mt-2 w-full max-w-xs"
                  />
                )}
                <label
                  htmlFor="file"
                  className="btn btn-primary cursor-pointer"
                >
                  Choose Image
                </label>
                <Button type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
          <div className="mt-4">
            {ramps.map((ramp) => (
              <div key={ramp.id} className="ramp-item flex flex-col">
                <h3>{ramp.ramp_type}</h3>
                <p>{ramp.materials}</p>
                <p>{`Width: ${ramp.width}, Height: ${ramp.height}, Length: ${ramp.length ? ramp.length : 'N/A'}`}</p>
                {ramp.construction_details && (
                  <p>{ramp.construction_details}</p>
                )}
                {ramp.image_url && (
                  <img
                    src={ramp.image_url}
                    alt="Ramp"
                    className="mt-2 w-full max-w-xs"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RampBuildTest;
