"use client";

import { useRouter } from "next/navigation";
import PersonForm from "../components/PersonForm";

export default function PersonPage() {
  const router = useRouter();

  const handleSubmit = (formData: any) => {
    console.log(formData);
    // Submit form data to API here
    alert("ຂໍ້ມູນຖືກບັນທຶກແລ້ວ");
    // router.push("/");
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <PersonForm 
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
} 