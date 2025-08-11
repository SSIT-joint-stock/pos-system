import type React from 'react';
import { useState, useCallback } from 'react';

interface UseImageFromFileReturn {
	imageFile: File | null;
	imageUrl: string | null;
	onImageFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	resolveImageUrl: (file: File) => Promise<string | ArrayBuffer | null>;
}

const useImageFromFile = (): {
	imageFile: File | null;
	imageUrl: string | null;
	resolveImageUrl: (file: File) => Promise<unknown>;
	onImageFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
} => {
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);

	const onImageFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImageUrl(reader.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			setImageFile(null);
			setImageUrl(null);
		}
	}, []);

	const resolveImageUrl = useCallback((file: File) => {
		return new Promise((resolve, reject) => {
			if (!(file instanceof File)) {
				reject(new Error('Input must be an instance of File.'));
				return;
			}
			const reader = new FileReader();
			reader.onload = (event) => {
				resolve(event.target?.result as string | ArrayBuffer | null);
			};
			reader.onerror = (error) => {
				// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
				reject(error);
			};
			reader.readAsDataURL(file);
		});
	}, []);

	return { imageFile, imageUrl, onImageFileChange, resolveImageUrl };
};

export default useImageFromFile;