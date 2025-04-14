"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";

interface DocumentTypeLinkProps {
  parcelId?: string;
}

const DocumentTypeLink = ({ parcelId: initialParcelId }: DocumentTypeLinkProps) => {
  const [parcelId, setParcelId] = useState<string>(initialParcelId || "");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!parcelId) {
      setError('ກະລຸນາປ້ອນເລກທີ່ດິນ');
      setLoading(false);
      return;
    }

    try {
      // Check if the PDF exists by trying to fetch the PDF
      const pdfUrl = `${apiBaseUrl}/parcel/pdf?parcel=${parcelId}`;
      const response = await fetch(pdfUrl);
      
      if (response.ok) {
        // If the PDF exists, redirect to the land management page
        router.push(`/land-management?parcel=${parcelId}`);
      } else {
        setError('ບໍ່ພົບເອກະສານ PDF ສຳລັບຕອນດິນນີ້');
      }
    } catch (err) {
      setError('ເກີດຂໍ້ຜິດພາດໃນການກວດສອບຂໍ້ມູນ');
      console.error('Error checking PDF existence:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div>
          <TextField
            label="ເລກທີ່ດິນ"
            variant="outlined"
            fullWidth
            value={parcelId}
            onChange={(e) => setParcelId(e.target.value)}
            disabled={loading}
            error={!!error}
            helperText={error}
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          className="h-12"
        >
          {loading ? <CircularProgress size={24} /> : 'ຄົ້ນຫາ'}
        </Button>
      </form>
    </div>
  );
};

export default DocumentTypeLink; 