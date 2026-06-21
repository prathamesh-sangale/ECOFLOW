import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadProductAttachment = async (fileBuffer: Buffer, fileName: string, contentType: string) => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration is missing in .env');
  }

  const { data, error } = await supabase.storage
    .from('product-files')
    .upload(fileName, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('product-files')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
};

export const deleteProductAttachment = async (fileUrl: string) => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration is missing in .env');
  }

  // Assuming fileUrl contains the file name at the end
  const urlParts = fileUrl.split('/');
  const fileName = urlParts[urlParts.length - 1];

  const { error } = await supabase.storage
    .from('product-files')
    .remove([fileName]);

  if (error) {
    throw error;
  }
};
