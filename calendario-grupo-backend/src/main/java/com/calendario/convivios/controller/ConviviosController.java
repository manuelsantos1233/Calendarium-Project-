package com.calendario.convivios.controller;

import com.calendario.convivios.dto.PhotoResponse;
import com.calendario.convivios.service.PhotoService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ConviviosController {

    private final PhotoService photoService;

    public ConviviosController(PhotoService photoService) {
        this.photoService = photoService;
    }

    @GetMapping("/photos")
    public List<PhotoResponse> getPhotos(@RequestParam(required = false) LocalDate date) {
        return photoService.getPhotos(date);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PhotoResponse> uploadPhoto(
            @RequestParam("date") LocalDate date,
            @RequestParam("user") String user,
            @RequestParam("caption") String caption,
            @RequestParam("photo") MultipartFile file) throws IOException {
        PhotoResponse photo = photoService.upload(date, user, caption, file);
        return ResponseEntity.status(201).body(photo);
    }

    @GetMapping("/photos/{id}/image")
    public ResponseEntity<Resource> getPhotoImage(@PathVariable Long id) throws IOException {
        PhotoService.StoredPhoto photo = photoService.getPhotoImage(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(photo.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .body(new ByteArrayResource(photo.content()));
    }
}
