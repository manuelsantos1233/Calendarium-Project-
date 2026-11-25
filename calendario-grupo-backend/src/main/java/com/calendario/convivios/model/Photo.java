package com.calendario.convivios.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "photos")
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "uploaded_by", nullable = false, length = 80)
    private String user;

    @Column(nullable = false, length = 500)
    private String caption;

    @Column(nullable = false, unique = true, length = 100)
    private String fileName;

    @Column(nullable = false, length = 30)
    private String contentType;

    @Column(nullable = false, updatable = false)
    private Instant uploadedAt;

    protected Photo() {
    }

    public Photo(LocalDate date, String user, String caption, String fileName, String contentType) {
        this.date = date;
        this.user = user;
        this.caption = caption;
        this.fileName = fileName;
        this.contentType = contentType;
    }

    @PrePersist
    void setUploadedAt() {
        uploadedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getUser() {
        return user;
    }

    public String getCaption() {
        return caption;
    }

    public String getFileName() {
        return fileName;
    }

    public String getContentType() {
        return contentType;
    }

    public Instant getUploadedAt() {
        return uploadedAt;
    }
}
