import api from "./axios"

export const uploadFile = async(file,onProgress)=>{
    const formData=new FormData();
    formData.append('file',file);

    const response=await api.post('/files',formData,{
        headers: {'Content-Type' : 'multipart/form-data'},
        onUploadProgress: (e)=>{
            const percent=Math.round((e.loaded*100)/e.total);
            onProgress(percent);
        }
    });

    return response.data;
}

export const uploadMultipleFiles = async (files, onProgress) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await api.post('/files/batch', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      const percent = Math.round((e.loaded * 100) / e.total);
      onProgress(percent);
    }
  });

  return response.data;
};

export const getFiles = async () => {
  const res = await api.get('/files');
  return res.data;
};

export const downloadFile = (id) => {
  window.open(`/api/files/${id}/download`, '_blank');
};

export const deleteFile = async (id) => {
  await api.delete(`/files/${id}`);
};
