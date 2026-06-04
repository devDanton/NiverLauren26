"use client";

import { useState } from 'react';
import Image from 'next/image';
import { uploadPhotoAction, deletePhotoAction, deleteAllPhotosAction } from './PhotoManagerActions';

export default function PhotoManager({ photos }: { photos: any[] }) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const processFile = async (file: File): Promise<{file: File, originalSize: number, originalName: string}> => {
    const originalSize = file.size;
    const originalName = file.name;

    if (file.name.toLowerCase().endsWith('.dng')) {
      throw new Error(`O arquivo ${file.name} é um formato RAW (DNG). Navegadores não suportam DNG. Converta-o para JPG antes de enviar.`);
    }

    if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
      try {
        const heic2any = (await import('heic2any')).default;
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.8
        });
        
        const blobArray = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        
        const convertedFile = new File(
          [blobArray],
          file.name.replace(/\.heic$/i, '.jpg'),
          { type: 'image/jpeg' }
        );

        return { file: convertedFile, originalSize, originalName };
      } catch (err: any) {
        console.error("Erro ao converter HEIC", err);
        if (err.message && err.message.includes('format not supported')) {
           throw new Error(`A foto ${file.name} usa um formato HEIC muito recente (como 'Live Photo' ou 'HDR') que o navegador não consegue converter. Por favor, tire um print da foto ou converta para JPG manualmente.`);
        }
        throw new Error(`Falha ao converter o arquivo HEIC: ${file.name}. Tente enviar uma versão JPG.`);
      }
    }

    return { file, originalSize, originalName };
  };

  const isDuplicate = (originalName: string, originalSize: number) => {
    if (!photos) return false;
    const safeName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const signature = `__${originalSize}__${safeName}`;
    
    return photos.some(photo => {
      const decodedUrl = decodeURIComponent(photo.url);
      return decodedUrl.includes(signature);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    setMessage('');
    
    const files = Array.from(e.target.files);
    let successCount = 0;
    
    for (const originalFile of files) {
      try {
        if (isDuplicate(originalFile.name, originalFile.size)) {
          console.log(`Skipping duplicate: ${originalFile.name}`);
          setMessage(`A foto ${originalFile.name} já foi enviada antes. (Ignorada)`);
          continue;
        }

        if (originalFile.name.toLowerCase().endsWith('.heic')) {
          setMessage(`Convertendo ${originalFile.name} de HEIC para JPG...`);
        }

        const processed = await processFile(originalFile);

        setMessage(`Enviando ${processed.file.name}...`);
        const formData = new FormData();
        formData.append('file', processed.file);
        formData.append('originalSize', processed.originalSize.toString());
        formData.append('originalName', processed.originalName);
        
        const result = await uploadPhotoAction(formData);
        
        if (result.error) {
          setMessage(result.error);
          break;
        } else {
          successCount++;
        }
      } catch (error: any) {
        console.error(`Erro ao processar ${originalFile.name}:`, error);
        setMessage(`Aviso: Pulando ${originalFile.name}. (${error.message || 'Erro'})`);
        continue;
      }
    }
    
    setUploading(false);
    
    if (successCount > 0) {
      setMessage(`${successCount} foto(s) enviada(s) com sucesso!`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deletar esta foto?')) {
      await deletePhotoAction(id);
    }
  };

  const handleDeleteAll = async () => {
    if (photos.length === 0) return;
    if (confirm('ATENÇÃO: Você tem certeza que deseja APAGAR TODAS AS FOTOS? Essa ação não pode ser desfeita.')) {
      setUploading(true);
      setMessage('Deletando todas as fotos...');
      const result = await deleteAllPhotosAction();
      setUploading(false);
      
      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage('Todas as fotos foram deletadas.');
        setTimeout(() => setMessage(''), 5000);
      }
    }
  };

  return (
    <div>
      <div style={{ position: 'relative', marginTop: '1rem', border: '2px dashed var(--color-her-pink)', padding: '2rem', textAlign: 'center', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255, 107, 129, 0.05)' }}>
        <input 
          type="file" 
          multiple 
          accept="image/*,.heic,.dng" 
          onChange={handleFileChange}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
          disabled={uploading}
        />
        <p>{uploading ? 'Processando...' : 'Arraste fotos aqui ou clique para fazer upload'}</p>
        {!uploading && <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>(Aceita JPG, PNG e HEIC. Duplicatas são ignoradas)</p>}
      </div>
      
      {message && <p style={{ marginTop: '1rem', color: message.includes('Erro') || message.includes('Falha') || message.includes('DNG') ? '#ff4757' : (message.includes('Ignorada') ? '#ffa502' : '#10ac84') }}>{message}</p>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem' }}>Fotos Adicionadas ({photos?.length || 0})</h3>
        {photos && photos.length > 0 && (
          <button 
            onClick={handleDeleteAll}
            disabled={uploading}
            style={{ background: 'transparent', border: '1px solid #ff4757', color: '#ff4757', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', opacity: uploading ? 0.5 : 1 }}
          >
            Deletar Todas
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        {photos && photos.map((photo) => (
          <div key={photo.id} style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333', background: '#000' }}>
            <Image src={photo.url} alt="Uploaded" fill sizes="120px" style={{ objectFit: 'cover' }} />
            <button 
              onClick={() => handleDelete(photo.id)}
              style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px' }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
