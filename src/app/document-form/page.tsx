"use client";

import DocumentViewerWithForm from "../components/DocumentViewerWithForm";
import { FormProvider } from "../contexts/FormContext";

export default function DocumentFormPage() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
          ຂໍ້ມູນຕອນດິນ ແລະ ເຈົ້າຂອງ
        </h1>
        
        <FormProvider>
          <DocumentViewerWithForm />
        </FormProvider>
      </div>
    </main>
  );
} 