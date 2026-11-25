package com.calendario.convivios.service;

import com.calendario.convivios.dto.PhotoResponse;
import com.calendario.convivios.model.Photo;
import com.calendario.convivios.repository.PhotoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.imageio.ImageIO;
import javax.imageio.IIOException;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class PhotoService {

    private static final Map<String, SupportedImage> SUPPORTED_TYPES = Map.of(
            "image/jpeg", new SupportedImage("jpg", "JPEG"),
            "image/png", new SupportedImage("png", "PNG"),
            "image/gif", new SupportedImage("gif", "GIF"));
    private static final long MAX_IMAGE_PIXELS = 25_000_000;

    private final PhotoRepository photoRepository;
    private final Path uploadDirectory;

    public PhotoService(
            PhotoRepository photoRepository,
            @Value("${app.upload-path}") String uploadPath) {
        this.photoRepository = photoRepository;
        this.uploadDirectory = Path.of(uploadPath).toAbsolutePath().normalize();
    }

    public List<PhotoResponse> getPhotos(LocalDate date) {
        List<Photo> photos = date == null
                ? photoRepository.findAllByOrderByDateDescUploadedAtDesc()
                : photoRepository.findByDateOrderByUploadedAtDesc(date);
        return photos.stream().map(PhotoResponse::from).toList();
    }

    public PhotoResponse upload(LocalDate date, String user, String caption, MultipartFile file)
            throws IOException {
        String normalizedUser = user.trim();
        String normalizedCaption = caption.trim();
        if (normalizedUser.isEmpty() || normalizedUser.length() > 80) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O nome deve ter entre 1 e 80 caracteres.");
        }
        if (normalizedCaption.length() > 500) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A legenda pode ter no máximo 500 caracteres.");
        }
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Seleciona uma fotografia.");
        }

        String contentType = file.getContentType();
        SupportedImage supportedImage = contentType == null ? null : SUPPORTED_TYPES.get(contentType);
        if (supportedImage == null || !isValidImage(file, supportedImage.format())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Formato não suportado. Usa uma imagem JPEG, PNG ou GIF válida.");
        }

        Files.createDirectories(uploadDirectory);
        String fileName = UUID.randomUUID() + "." + supportedImage.extension();
        Path destination = uploadDirectory.resolve(fileName).normalize();
        if (!destination.startsWith(uploadDirectory)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ficheiro inválido.");
        }

        try (var inputStream = file.getInputStream()) {
            Files.copy(inputStream, destination);
        }
        try {
            Photo savedPhoto = photoRepository.save(
                    new Photo(date, normalizedUser, normalizedCaption, fileName, contentType));
            return PhotoResponse.from(savedPhoto);
        } catch (RuntimeException exception) {
            Files.deleteIfExists(destination);
            throw exception;
        }
    }

    public StoredPhoto getPhotoImage(Long id) throws IOException {
        Photo photo = photoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fotografia não encontrada."));
        Path imagePath = uploadDirectory.resolve(photo.getFileName()).normalize();
        if (!imagePath.startsWith(uploadDirectory)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Fotografia não encontrada.");
        }
        return new StoredPhoto(photo.getContentType(), Files.readAllBytes(imagePath));
    }

    private boolean isValidImage(MultipartFile file, String expectedFormat) throws IOException {
        try (var inputStream = file.getInputStream();
             ImageInputStream imageInput = ImageIO.createImageInputStream(inputStream)) {
            if (imageInput == null) {
                return false;
            }
            Iterator<ImageReader> readers = ImageIO.getImageReaders(imageInput);
            if (!readers.hasNext()) {
                return false;
            }
            ImageReader reader = readers.next();
            try {
                reader.setInput(imageInput, true, true);
                int width = reader.getWidth(0);
                int height = reader.getHeight(0);
                return reader.getFormatName().equalsIgnoreCase(expectedFormat)
                        && width > 0
                        && height > 0
                        && (long) width * height <= MAX_IMAGE_PIXELS;
            } catch (IIOException exception) {
                return false;
            } finally {
                reader.dispose();
            }
        }
    }

    public record StoredPhoto(String contentType, byte[] content) {
    }

    private record SupportedImage(String extension, String format) {
    }
}
