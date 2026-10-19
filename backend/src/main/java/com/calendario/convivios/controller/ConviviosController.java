package com.calendario.convivios.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ConviviosController {

    private final String UPLOAD_DIR = "uploads/";

    @GetMapping("/photos")
    public ResponseEntity<Map<String, Object>> getPhotos() {
        // Simulação de resposta com dados dos convívios por data
        Map<String, Object> data = new HashMap<>();
        return ResponseEntity.ok(data);
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadPhoto(
            @RequestParam("date") String date,
            @RequestParam("user") String user,
            @RequestParam("caption") String caption,
            @RequestParam("photo") MultipartFile file) {

        Map<String, String> response = new HashMap<>();
        try {
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            response.put("status", "success");
            response.put("url", "/uploads/" + fileName);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
