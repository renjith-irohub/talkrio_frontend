
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { FaImage, FaPaperPlane } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { createPostAPI } from "../services/postServices";

const postSchema = Yup.object().shape({
  content: Yup.string()
    .required("Post cannot be empty")
    .max(300, "Post must be less than 300 characters"),
});

const Addpost = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const navigate = useNavigate();
  
  const mutation = useMutation({
    mutationFn: async (formData) => {
      return await createPostAPI(formData);
    },
    onSuccess: (data) => {
      alert("Post uploaded successfully!");
      navigate(`/postview`);
  }
  
  });
  const formik = useFormik({
    initialValues: { content: "" },
    validationSchema: postSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        // Corrected the quotes here
        formData.append("content", values.content);
        
        imageFiles.forEach((file) => {
          // Corrected the quotes here
          formData.append("images", file);
        });
  
        await mutation.mutateAsync(formData);
        setSelectedImages([]);
        setImageFiles([]);
        resetForm();
      } catch (error) {
        // In your catch block
        alert(`Post failed: ${error.message}`);
        console.error("Post creation failed:", error);
      }
    },
  });

  const onDrop = (acceptedFiles) => {
    setImageFiles([...imageFiles, ...acceptedFiles]);
    setSelectedImages([...selectedImages, ...acceptedFiles.map(file => URL.createObjectURL(file))]);
    // In your onDrop function
if (imageFiles.length + acceptedFiles.length > 5) {
  alert("Maximum 5 images allowed");
  return;
}
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif','.webp'] },
    onDrop,
    maxFiles: 5,
  });

  const removeImage = (index) => {
    const updatedImages = [...selectedImages];
    const updatedFiles = [...imageFiles];
    updatedImages.splice(index, 1);
    updatedFiles.splice(index, 1);
    setSelectedImages(updatedImages);
    setImageFiles(updatedFiles);
  };

  const characterCount = formik.values.content.length;
  const maxCharacters = 300;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />
      <div className="pt-24 px-6 max-w-2xl mx-auto space-y-6">
        <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
              <FaPaperPlane size={16} />
            </span>
            Create a Post
          </h3>
          
          <div className="mb-4">
            <textarea
              name="content"
              rows="4"
              placeholder="Share your thoughts..."
              className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
              value={formik.values.content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            
            <div className="flex justify-between mt-2 text-sm">
              {formik.touched.content && formik.errors.content ? (
                <p className="text-red-500">{formik.errors.content}</p>
              ) : (
                <p className="text-gray-400">Express yourself!</p>
              )}
              <p className={`${characterCount > maxCharacters ? 'text-red-500' : characterCount > maxCharacters * 0.8 ? 'text-amber-500' : 'text-gray-400'}`}>
                {characterCount}/{maxCharacters}
              </p>
            </div>
          </div>
          
          <div 
            {...getRootProps()} 
            className="border-dashed border-2 border-blue-200 p-5 rounded-lg text-center mt-4 cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
          >
            <input {...getInputProps()} />
            <FaImage className="text-blue-400 mx-auto mb-3" size={28} />
            <p className="text-blue-600 font-medium">Drag & drop or click to upload images</p>
            <p className="text-gray-500 text-sm mt-1">You can add up to 5 images</p>
          </div>
          
          {selectedImages.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-medium text-gray-700 mb-2">Selected images ({selectedImages.length}/5)</p>
              <div className="grid grid-cols-3 gap-3">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative group overflow-hidden rounded-lg">
                    <img src={image} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200"></div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {mutation.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">Error creating post: {mutation.error.message}</p>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={mutation.isLoading || !formik.isValid}
            className={`mt-5 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center ${(mutation.isLoading || !formik.isValid) ? "opacity-50 cursor-not-allowed" : "shadow-md hover:shadow-lg"}`}
          >
            {mutation.isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Posting...</span>
              </>
            ) : (
              <>
                <FaPaperPlane className="mr-2" />
                <span>Share Post</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addpost;
