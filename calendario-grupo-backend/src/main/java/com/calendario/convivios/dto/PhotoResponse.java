package com.calendario.convivios.dto;

import com.calendario.convivios.model.Photo;

import java.time.Instant;
import java.time.LocalDate;

public record PhotoResponse(
        Long id,
        LocalDate date,
        String user,
        String caption,
        String url,
        Instant uploadedAt) {

    public static PhotoResponse from(Photo photo) {
        return new PhotoResponse(
                photo.getId(),
                photo.getDate(),
                photo.getUser(),
                photo.getCaption(),
                "/api/photos/" + photo.getId() + "/image",
                photo.getUploadedAt());
    }
}
